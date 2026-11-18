import { v } from "convex/values";
import { query } from "./_generated/server";
import { CATEGORY_LABELS, QUESTIONS } from "./lib/questionBank";

const cell = v.object({
  shape: v.union(
    v.literal("circle"),
    v.literal("square"),
    v.literal("triangle"),
    v.literal("diamond"),
  ),
  fill: v.union(v.literal("outline"), v.literal("tint"), v.literal("solid")),
  count: v.number(),
  rotation: v.number(),
});

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      id: v.string(),
      category: v.string(),
      prompt: v.string(),
      matrix: v.optional(v.array(v.union(cell, v.null()))),
      options: v.array(v.union(v.string(), cell)),
    }),
  ),
  handler: async () =>
    // Правильный ответ и сложность намеренно не возвращаются.
    QUESTIONS.map((q) => ({
      id: q.id,
      category: CATEGORY_LABELS[q.category],
      prompt: q.prompt,
      ...(q.matrix ? { matrix: q.matrix } : {}),
      options: q.options,
    })),
});
