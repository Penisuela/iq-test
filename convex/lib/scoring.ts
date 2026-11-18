import { CATEGORY_LABELS, type Category, type Question } from "./questionBank";

export type Answer = { questionId: string; option: number };

export type Score = {
  iq: number;
  percentile: number;
  categories: { category: string; correct: number; total: number }[];
};

const IQ_MIN = 70;
const IQ_MAX = 145;

// Аппроксимация функции нормального распределения (Абрамовиц — Стиган).
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

export function scoreAttempt(questions: Question[], answers: Answer[]): Score {
  const chosen = new Map(answers.map((a) => [a.questionId, a.option]));
  const byCategory = new Map<Category, { correct: number; total: number }>();
  let earned = 0;
  let possible = 0;

  for (const q of questions) {
    const isCorrect = chosen.get(q.id) === q.correct;
    possible += q.difficulty;
    if (isCorrect) earned += q.difficulty;

    const bucket = byCategory.get(q.category) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (isCorrect) bucket.correct += 1;
    byCategory.set(q.category, bucket);
  }

  // Доля набранных баллов с весом по сложности: 50% соответствует IQ 100.
  const share = possible === 0 ? 0 : earned / possible;
  const z = (share - 0.5) / 0.2;
  const iq = Math.min(IQ_MAX, Math.max(IQ_MIN, Math.round(100 + 15 * z)));
  const percentile = Math.min(
    99,
    Math.max(1, Math.round(normalCdf((iq - 100) / 15) * 100)),
  );

  return {
    iq,
    percentile,
    categories: [...byCategory.entries()].map(([category, s]) => ({
      category: CATEGORY_LABELS[category],
      ...s,
    })),
  };
}
