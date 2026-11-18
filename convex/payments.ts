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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(normalized)) {
    throw new ConvexError("Укажите корректный email");
  }
  return normalized;
}

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

    const normalizedEmail = normalizeEmail(email);

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

// Отмена подписки по email. Ответ одинаков для любого адреса,
// чтобы по нему нельзя было узнать, есть ли такой email в базе.
export const cancelSubscription = mutation({
  args: { email: v.string() },
  returns: v.null(),
  handler: async (ctx, { email }) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_email", (q) => q.eq("email", normalizeEmail(email)))
      .collect();
    for (const payment of payments) {
      if (payment.cancelledAt === undefined) {
        await ctx.db.patch(payment._id, { cancelledAt: Date.now() });
      }
    }
    return null;
  },
});
