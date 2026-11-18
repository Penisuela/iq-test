import { ConvexError } from "convex/values";
import type { QueryCtx } from "../_generated/server";

export async function getAttemptByToken(ctx: QueryCtx, token: string) {
  const attempt = await ctx.db
    .query("attempts")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  if (!attempt) throw new ConvexError("Попытка не найдена");
  return attempt;
}
