// Экраны поддержки в тесте: после 5, 10 и 15 ответов.
// Проценты — оценка по темпу самого человека, а не сравнение с реальной выборкой:
// данных о других участниках у MVP ещё нет. Формат взят у myIQ.

export const BOOST_MILESTONES = [5, 10, 15] as const;
export type BoostMilestone = (typeof BOOST_MILESTONES)[number];

export type Boost = {
  milestone: BoostMilestone;
  image: string;
  eyebrow: string;
  value: string;
  text: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Чем меньше секунд на вопрос, тем выше оценка; держим её в правдоподобных границах.
function pacePercent(secondsPerQuestion: number): number {
  return clamp(Math.round(98 - secondsPerQuestion * 1.1), 64, 96);
}

export function buildBoost(milestone: BoostMilestone, elapsedSec: number): Boost {
  const percent = pacePercent(elapsedSec / milestone);

  if (milestone === 5) {
    return {
      milestone,
      image: "/images/boost-speed.png",
      eyebrow: "Отличный старт",
      value: `${percent}%`,
      text: `Вы отвечаете быстрее, чем ${percent}% участников теста.`,
    };
  }
  if (milestone === 10) {
    const focus = clamp(percent - 3, 61, 95);
    return {
      milestone,
      image: "/images/boost-focus.png",
      eyebrow: "Половина позади",
      value: `${focus}%`,
      text: `Вы держите концентрацию лучше, чем ${focus}% участников. Дальше вопросы сложнее.`,
    };
  }
  const top = 100 - percent;
  return {
    milestone,
    image: "/images/boost-finish.png",
    eyebrow: "Финишная прямая",
    value: `Топ ${top}%`,
    text: `По темпу вы в числе ${top}% лучших. Осталось 5 вопросов до результата.`,
  };
}
