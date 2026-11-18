import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { getAttemptByToken } from "./lib/attempt";
import { PLANS } from "./lib/plans";

export const plans = query({
  args: {},
  returns: v.array(
    v.object({
      id: v.string(),
      title: v.string(),
      price: v.number(),
      currency: v.literal("RUB"),
      terms: v.string(),
      recurring: v.boolean(),
    }),
  ),
  handler: async () => PLANS,
});

// Имитация оплаты: реального платёжного провайдера нет, списаний не происходит.
export const checkout = mutation({
  args: { token: v.string(), planId: v.string(), email: v.string() },
  returns: v.null(),
  handler: async (ctx, { token, planId, email }) => {
    const attempt = await getAttemptByToken(ctx, token);
    if (attempt.status !== "finished") {
      throw new ConvexError("Сначала завершите тест");
    }
    if (attempt.paid) return null;

    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) throw new ConvexError("Тариф не найден");

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new ConvexError("Укажите корректный email");
    }

    await ctx.db.insert("payments", {
      attemptId: attempt._id,
      planId: plan.id,
      amount: plan.price,
      currency: plan.currency,
      email: normalizedEmail,
      status: "succeeded",
    });
    await ctx.runMutation(internal.attempts.markPaid, {
      attemptId: attempt._id,
    });
    return null;
  },
});
