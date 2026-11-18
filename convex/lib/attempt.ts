import { ConvexError } from "convex/values";
import type { QueryCtx } from "../_generated/server";

export function findAttemptByToken(ctx: QueryCtx, token: string) {
  return ctx.db
    .query("attempts")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
}

export async function getAttemptByToken(ctx: QueryCtx, token: string) {
  const attempt = await findAttemptByToken(ctx, token);
  if (!attempt) throw new ConvexError("Попытка не найдена");
  return attempt;
}

// Подписка активна, пока есть хотя бы один успешный и не отменённый платёж с этим email.
export async function hasActiveSubscription(ctx: QueryCtx, email: string) {
  const payments = await ctx.db
    .query("payments")
    .withIndex("by_email", (q) => q.eq("email", email))
    .collect();
  return payments.some((p) => p.status === "succeeded" && p.cancelledAt === undefined);
}
