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
