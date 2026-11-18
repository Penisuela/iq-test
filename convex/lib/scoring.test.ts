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

  test("в заданиях-матрицах 9 клеток, одна пропущена, варианты не повторяются", () => {
    const matrices = QUESTIONS.filter((q) => q.matrix);
    expect(matrices.length).toBeGreaterThan(0);
    for (const q of matrices) {
      expect(q.matrix).toHaveLength(9);
      expect(q.matrix!.filter((c) => c === null)).toHaveLength(1);
      expect(q.matrix![8]).toBeNull();
      const options = q.options.map((o) => JSON.stringify(o));
      expect(new Set(options).size).toBe(options.length);
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
