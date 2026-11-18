import { describe, expect, test } from "vitest";
import { QUESTIONS } from "./questionBank";
import { scoreAttempt } from "./scoring";

const allCorrect = QUESTIONS.map((q) => ({ questionId: q.id, option: q.correct }));

describe("банк вопросов", () => {
  test("id уникальны, правильный ответ есть среди вариантов", () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    for (const q of QUESTIONS) {
      expect(q.options[q.correct]).toBeDefined();
    }
  });
});

describe("scoreAttempt", () => {
  test("все ответы верные — максимальный IQ", () => {
    const score = scoreAttempt(QUESTIONS, allCorrect);
    expect(score.iq).toBe(138);
    expect(score.percentile).toBe(99);
    expect(score.categories.every((c) => c.correct === c.total)).toBe(true);
  });

  test("нет ответов — минимальный IQ", () => {
    const score = scoreAttempt(QUESTIONS, []);
    expect(score.iq).toBe(70);
    expect(score.categories.every((c) => c.correct === 0)).toBe(true);
  });

  test("сложные вопросы весят больше лёгких", () => {
    const pick = (difficulty: number) =>
      allCorrect.filter(
        (a) => QUESTIONS.find((q) => q.id === a.questionId)!.difficulty === difficulty,
      ).slice(0, 4);
    expect(scoreAttempt(QUESTIONS, pick(3)).iq).toBeGreaterThan(
      scoreAttempt(QUESTIONS, pick(1)).iq,
    );
  });

  test("категории покрывают все вопросы", () => {
    const { categories } = scoreAttempt(QUESTIONS, allCorrect);
    expect(categories.reduce((sum, c) => sum + c.total, 0)).toBe(QUESTIONS.length);
  });
});
