import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { findAttemptByToken, getAttemptByToken, hasActiveSubscription } from "./lib/attempt";
import { QUESTIONS } from "./lib/questionBank";
import { scoreAttempt } from "./lib/scoring";
import { categoryScore } from "./schema";

// previousToken — токен прошлой попытки. Если она была оплачена и подписка
// не отменена, новая попытка сразу открыта: подписчик не платит второй раз.
export const start = mutation({
  args: { previousToken: v.optional(v.string()) },
  returns: v.object({ token: v.string() }),
  handler: async (ctx, { previousToken }) => {
    const previous = previousToken ? await findAttemptByToken(ctx, previousToken) : null;
    const email = previous?.paid ? previous.email : undefined;
    const subscribed = email !== undefined && (await hasActiveSubscription(ctx, email));

    const token = crypto.randomUUID();
    await ctx.db.insert("attempts", {
      token,
      status: "in_progress",
      answers: [],
      startedAt: Date.now(),
      paid: subscribed,
      ...(subscribed ? { email } : {}),
    });
    return { token };
  },
});

export const answer = mutation({
  args: { token: v.string(), questionId: v.string(), option: v.number() },
  returns: v.null(),
  handler: async (ctx, { token, questionId, option }) => {
    const attempt = await getAttemptByToken(ctx, token);
    if (attempt.status !== "in_progress") {
      throw new ConvexError("Тест уже завершён");
    }
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question || !Number.isInteger(option) || !(option in question.options)) {
      throw new ConvexError("Некорректный ответ");
    }
    const answers = attempt.answers.filter((a) => a.questionId !== questionId);
    answers.push({ questionId, option });
    await ctx.db.patch(attempt._id, { answers });
    return null;
  },
});

export const finish = mutation({
  args: { token: v.string() },
  returns: v.null(),
  handler: async (ctx, { token }) => {
    const attempt = await getAttemptByToken(ctx, token);
    if (attempt.status === "finished") return null;
    await ctx.db.patch(attempt._id, {
      status: "finished",
      finishedAt: Date.now(),
      ...scoreAttempt(QUESTIONS, attempt.answers),
    });
    return null;
  },
});

// Тизер для paywall: без балла и без разбивки по категориям.
// null — попытки с таким токеном нет (например, в браузере остался старый токен).
export const paywall = query({
  args: { token: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      status: v.union(v.literal("in_progress"), v.literal("finished")),
      paid: v.boolean(),
      startedAt: v.number(),
      // Собственные ответы пользователя — чтобы показать выбранное при возврате к вопросу.
      answers: v.array(v.object({ questionId: v.string(), option: v.number() })),
      answered: v.number(),
      total: v.number(),
      durationSec: v.union(v.number(), v.null()),
    }),
  ),
  handler: async (ctx, { token }) => {
    const attempt = await findAttemptByToken(ctx, token);
    if (!attempt) return null;
    return {
      status: attempt.status,
      paid: attempt.paid,
      startedAt: attempt.startedAt,
      answers: attempt.answers,
      answered: attempt.answers.length,
      total: QUESTIONS.length,
      durationSec: attempt.finishedAt
        ? Math.round((attempt.finishedAt - attempt.startedAt) / 1000)
        : null,
    };
  },
});

export const result = query({
  args: { token: v.string() },
  returns: v.union(
    v.object({ locked: v.literal(true) }),
    v.object({
      locked: v.literal(false),
      iq: v.number(),
      percentile: v.number(),
      categories: v.array(categoryScore),
    }),
  ),
  handler: async (ctx, { token }) => {
    const attempt = await findAttemptByToken(ctx, token);
    if (
      !attempt?.paid ||
      attempt.iq === undefined ||
      attempt.percentile === undefined ||
      attempt.categories === undefined
    ) {
      return { locked: true as const };
    }
    return {
      locked: false as const,
      iq: attempt.iq,
      percentile: attempt.percentile,
      categories: attempt.categories,
    };
  },
});

// Вызывается только с сервера: сейчас имитацией оплаты, позже вебхуком провайдера.
export const markPaid = internalMutation({
  args: { attemptId: v.id("attempts"), email: v.string() },
  returns: v.null(),
  handler: async (ctx, { attemptId, email }) => {
    await ctx.db.patch(attemptId, { paid: true, email });
    return null;
  },
});
