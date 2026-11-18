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
    expect((await t.query(api.attempts.paywall, { token })).answered).toBe(1);
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
    await t.mutation(api.payments.checkout, {
      token,
      planId: "trial",
      email: " User@Example.com ",
    });

    const result = await t.query(api.attempts.result, { token });
    expect(result).toMatchObject({ locked: false, iq: 138, percentile: 99 });

    const payments = await t.run((ctx) => ctx.db.query("payments").collect());
    expect(payments).toHaveLength(1);
    expect(payments[0]).toMatchObject({
      planId: "trial",
      amount: 49,
      email: "user@example.com",
      status: "succeeded",
    });
  });

  test("повторная оплата не создаёт второй платёж", async () => {
    const { t, token } = await finishedAttempt();
    const args = { token, planId: "single", email: "a@b.ru" };
    await t.mutation(api.payments.checkout, args);
    await t.mutation(api.payments.checkout, args);
    const payments = await t.run((ctx) => ctx.db.query("payments").collect());
    expect(payments).toHaveLength(1);
  });

  test("нельзя оплатить незавершённый тест, неизвестный тариф или с плохим email", async () => {
    const t = convexTest(schema, modules);
    const { token } = await t.mutation(api.attempts.start, {});
    const pay = (planId: string, email: string) =>
      t.mutation(api.payments.checkout, { token, planId, email });

    await expect(pay("trial", "a@b.ru")).rejects.toThrow();
    await t.mutation(api.attempts.finish, { token });
    await expect(pay("unknown", "a@b.ru")).rejects.toThrow();
    await expect(pay("trial", "не email")).rejects.toThrow();
    expect(await t.query(api.attempts.result, { token })).toEqual({ locked: true });
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
});
