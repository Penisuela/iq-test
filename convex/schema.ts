import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const categoryScore = v.object({
  category: v.string(),
  correct: v.number(),
  total: v.number(),
});

export default defineSchema({
  attempts: defineTable({
    token: v.string(),
    status: v.union(v.literal("in_progress"), v.literal("finished")),
    answers: v.array(v.object({ questionId: v.string(), option: v.number() })),
    startedAt: v.number(),
    finishedAt: v.optional(v.number()),
    iq: v.optional(v.number()),
    percentile: v.optional(v.number()),
    categories: v.optional(v.array(categoryScore)),
    paid: v.boolean(),
  }).index("by_token", ["token"]),

  payments: defineTable({
    attemptId: v.id("attempts"),
    amount: v.number(),
    currency: v.string(),
    email: v.string(),
    status: v.union(v.literal("succeeded"), v.literal("failed")),
    // Момент отмены подписки; пока её не отменили, поля нет.
    cancelledAt: v.optional(v.number()),
  })
    .index("by_attempt", ["attemptId"])
    .index("by_email", ["email"]),

  events: defineTable({
    token: v.optional(v.string()),
    name: v.string(),
    // Для cta_click: с какой кнопки начали тест.
    source: v.optional(v.string()),
  }).index("by_name", ["name"]),
});
