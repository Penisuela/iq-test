import { v } from "convex/values";
import { query } from "./_generated/server";
import { CATEGORY_LABELS, QUESTIONS } from "./lib/questionBank";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      id: v.string(),
      category: v.string(),
      prompt: v.string(),
      options: v.array(v.string()),
    }),
  ),
  handler: async () =>
    // Правильный ответ и сложность намеренно не возвращаются.
    QUESTIONS.map((q) => ({
      id: q.id,
      category: CATEGORY_LABELS[q.category],
      prompt: q.prompt,
      options: q.options,
    })),
});
