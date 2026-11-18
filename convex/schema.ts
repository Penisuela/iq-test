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
  }).index("by_attempt", ["attemptId"]),

  events: defineTable({
    token: v.optional(v.string()),
    name: v.string(),
  }).index("by_name", ["name"]),
});
