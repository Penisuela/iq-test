export function iqLevel(iq: number): { title: string; text: string } {
  if (iq >= 130)
    return {
      title: "Высокий",
      text: "Такой результат показывают около 2% участников. Вы быстро находите закономерности в незнакомых задачах.",
    };
  if (iq >= 115)
    return {
      title: "Выше среднего",
      text: "Вы справляетесь с задачами на логику и закономерности увереннее большинства.",
    };
  if (iq >= 85)
    return {
      title: "Средний",
      text: "Ваш результат в диапазоне, в который попадает большинство людей: от 85 до 115.",
    };
  return {
    title: "Ниже среднего",
    text: "Результат мог занизиться из-за спешки или усталости. Попробуйте пройти тест ещё раз в спокойной обстановке.",
  };
}

export function formatDuration(totalSec: number): string {
  const minutes = Math.floor(totalSec / 60);
  const seconds = String(totalSec % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
