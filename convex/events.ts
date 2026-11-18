import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const FUNNEL_EVENTS = [
  "landing_view",
  "quiz_start",
  "quiz_finish",
  "paywall_view",
  "checkout_view",
  "payment_success",
  "result_view",
] as const;

export const track = mutation({
  args: {
    name: v.union(...FUNNEL_EVENTS.map((name) => v.literal(name))),
    token: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { name, token }) => {
    await ctx.db.insert("events", { name, token });
    return null;
  },
});
