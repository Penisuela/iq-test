import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const FUNNEL_EVENTS = [
  "landing_view",
  "cta_click",
  "quiz_start",
  "quiz_finish",
  "paywall_view",
  "checkout_view",
  "payment_success",
  "result_view",
] as const;

// Кнопки «Начать тест» на главной: по ним видно, какой блок приводит в тест.
export const CTA_SOURCES = ["header", "hero", "sticky", "final"] as const;

export const track = mutation({
  args: {
    name: v.union(...FUNNEL_EVENTS.map((name) => v.literal(name))),
    token: v.optional(v.string()),
    source: v.optional(v.union(...CTA_SOURCES.map((source) => v.literal(source)))),
  },
  returns: v.null(),
  handler: async (ctx, event) => {
    await ctx.db.insert("events", event);
    return null;
  },
});
