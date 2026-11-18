/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import { QUESTIONS } from "./lib/questionBank";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

async function finishedAttempt() {
  const t = convexTest(schema, modules);
  const { token } = await t.mutation(api.attempts.start, {});
  for (const q of QUESTIONS) {
    await t.mutation(api.attempts.answer, {
      token,
      questionId: q.id,
      option: q.correct,
    });
  }
  await t.mutation(api.attempts.finish, { token });
  return { t, token };
}

describe("вопросы", () => {
  test("правильные ответы не уходят клиенту", async () => {
    const t = convexTest(schema, modules);
    const questions = await t.query(api.questions.list, {});
    expect(questions).toHaveLength(QUESTIONS.length);
    for (const q of questions) {
      expect(q).not.toHaveProperty("correct");
      expect(q).not.toHaveProperty("difficulty");
    }
  });
});

describe("попытка", () => {
  test("повторный ответ на вопрос заменяет предыдущий", async () => {
    const t = convexTest(schema, modules);
    const { token } = await t.mutation(api.attempts.start, {});
    await t.mutation(api.attempts.answer, { token, questionId: "n1", option: 0 });
    await t.mutation(api.attempts.answer, { token, questionId: "n1", option: 3 });
    const attempt = await t.query(api.attempts.paywall, { token });
    expect(attempt?.answered).toBe(1);
    expect(attempt?.answers).toEqual([{ questionId: "n1", option: 3 }]);
  });

  test("неизвестный токен не роняет запросы", async () => {
    const t = convexTest(schema, modules);
    expect(await t.query(api.attempts.paywall, { token: "старый" })).toBeNull();
    expect(await t.query(api.attempts.result, { token: "старый" })).toEqual({ locked: true });
  });

  test("несуществующий вариант и чужой токен отклоняются", async () => {
    const t = convexTest(schema, modules);
    const { token } = await t.mutation(api.attempts.start, {});
    await expect(
      t.mutation(api.attempts.answer, { token, questionId: "n1", option: 9 }),
    ).rejects.toThrow();
    await expect(
      t.mutation(api.attempts.answer, { token: "чужой", questionId: "n1", option: 0 }),
    ).rejects.toThrow();
  });

  test("после завершения ответы не принимаются", async () => {
    const { t, token } = await finishedAttempt();
    await expect(
      t.mutation(api.attempts.answer, { token, questionId: "n1", option: 0 }),
    ).rejects.toThrow();
  });
});

describe("paywall", () => {
  test("до оплаты результат закрыт, тизер не содержит балла", async () => {
    const { t, token } = await finishedAttempt();
    expect(await t.query(api.attempts.result, { token })).toEqual({ locked: true });

    const teaser = await t.query(api.attempts.paywall, { token });
    expect(teaser).toMatchObject({ status: "finished", paid: false, answered: QUESTIONS.length });
    expect(teaser).not.toHaveProperty("iq");
    expect(teaser).not.toHaveProperty("percentile");
  });

  test("оплата открывает результат и сохраняется в базе", async () => {
    const { t, token } = await finishedAttempt();
    await t.mutation(api.payments.checkout, { token, email: " User@Example.com " });

    const result = await t.query(api.attempts.result, { token });
    expect(result).toMatchObject({ locked: false, iq: 138, percentile: 99 });

    const payments = await t.run((ctx) => ctx.db.query("payments").collect());
    expect(payments).toHaveLength(1);
    expect(payments[0]).toMatchObject({
      amount: 49,
      email: "user@example.com",
      status: "succeeded",
    });
  });

  test("повторная оплата не создаёт второй платёж", async () => {
    const { t, token } = await finishedAttempt();
    const args = { token, email: "a@b.ru" };
    await t.mutation(api.payments.checkout, args);
    await t.mutation(api.payments.checkout, args);
    const payments = await t.run((ctx) => ctx.db.query("payments").collect());
    expect(payments).toHaveLength(1);
  });

  test("нельзя оплатить незавершённый тест или с плохим email", async () => {
    const t = convexTest(schema, modules);
    const { token } = await t.mutation(api.attempts.start, {});
    const pay = (email: string) => t.mutation(api.payments.checkout, { token, email });

    await expect(pay("a@b.ru")).rejects.toThrow();
    await t.mutation(api.attempts.finish, { token });
    await expect(pay("не email")).rejects.toThrow();
    expect(await t.query(api.attempts.result, { token })).toEqual({ locked: true });
  });
});

describe("отмена подписки", () => {
  test("отменяет платежи с этим email и не трогает чужие", async () => {
    const { t, token } = await finishedAttempt();
    await t.mutation(api.payments.checkout, { token, email: "user@example.com" });

    await t.mutation(api.payments.cancelSubscription, { email: "other@example.com" });
    let payments = await t.run((ctx) => ctx.db.query("payments").collect());
    expect(payments[0].cancelledAt).toBeUndefined();

    await t.mutation(api.payments.cancelSubscription, { email: " USER@example.com " });
    payments = await t.run((ctx) => ctx.db.query("payments").collect());
    expect(payments[0].cancelledAt).toBeTypeOf("number");
  });

  test("после отмены оплаченный результат остаётся доступен", async () => {
    const { t, token } = await finishedAttempt();
    await t.mutation(api.payments.checkout, { token, email: "user@example.com" });
    await t.mutation(api.payments.cancelSubscription, { email: "user@example.com" });
    expect(await t.query(api.attempts.result, { token })).toMatchObject({ locked: false });
  });

  test("некорректный email отклоняется", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.payments.cancelSubscription, { email: "не email" }),
    ).rejects.toThrow();
  });
});

describe("события воронки", () => {
  test("сохраняются известные события, неизвестные отклоняются", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.events.track, { name: "landing_view" });
    await expect(
      // @ts-expect-error неизвестное событие
      t.mutation(api.events.track, { name: "hack" }),
    ).rejects.toThrow();
    const events = await t.run((ctx) => ctx.db.query("events").collect());
    expect(events).toHaveLength(1);
  });

  test("клик по кнопке старта сохраняется с источником", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.events.track, { name: "cta_click", source: "sticky" });
    const events = await t.run((ctx) => ctx.db.query("events").collect());
    expect(events[0]).toMatchObject({ name: "cta_click", source: "sticky" });
  });
});
