import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { getAttemptByToken } from "./lib/attempt";
import { OFFER } from "./lib/offer";

export const offer = query({
  args: {},
  returns: v.object({
    title: v.string(),
    price: v.number(),
    currency: v.literal("RUB"),
    terms: v.string(),
  }),
  handler: async () => OFFER,
});

// Имитация оплаты: реального платёжного провайдера нет, списаний не происходит.
export const checkout = mutation({
  args: { token: v.string(), email: v.string() },
  returns: v.null(),
  handler: async (ctx, { token, email }) => {
    const attempt = await getAttemptByToken(ctx, token);
    if (attempt.status !== "finished") {
      throw new ConvexError("Сначала завершите тест");
    }
    if (attempt.paid) return null;

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new ConvexError("Укажите корректный email");
    }

    await ctx.db.insert("payments", {
      attemptId: attempt._id,
      amount: OFFER.price,
      currency: OFFER.currency,
      email: normalizedEmail,
      status: "succeeded",
    });
    await ctx.runMutation(internal.attempts.markPaid, {
      attemptId: attempt._id,
    });
    return null;
  },
});
