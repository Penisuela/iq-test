// Банк вопросов живёт только на сервере: поле `correct` не уходит в браузер.

export type Category = "logic" | "numeric" | "verbal";

export type Question = {
  id: string;
  category: Category;
  difficulty: 1 | 2 | 3;
  prompt: string;
  options: string[];
  correct: number;
};

export const CATEGORY_LABELS: Record<Category, string> = {
  logic: "Логика",
  numeric: "Числа",
  verbal: "Вербальное мышление",
};

export const QUESTIONS: Question[] = [
  {
    id: "n1",
    category: "numeric",
    difficulty: 1,
    prompt: "Какое число продолжает ряд: 2, 4, 8, 16, …?",
    options: ["20", "24", "30", "32"],
    correct: 3,
  },
  {
    id: "l1",
    category: "logic",
    difficulty: 1,
    prompt:
      "Все розы — цветы. Некоторые цветы быстро вянут. Что следует из этого наверняка?",
    options: [
      "Все розы быстро вянут",
      "Некоторые розы быстро вянут",
      "Все розы — цветы",
      "Ни одна роза не вянет",
    ],
    correct: 2,
  },
  {
    id: "v1",
    category: "verbal",
    difficulty: 1,
    prompt: "Птица относится к гнезду так же, как пчела — к …",
    options: ["мёду", "улью", "цветку", "рою"],
    correct: 1,
  },
  {
    id: "n2",
    category: "numeric",
    difficulty: 1,
    prompt: "Какого числа не хватает: 3, 6, 9, …, 15?",
    options: ["10", "11", "12", "13"],
    correct: 2,
  },
  {
    id: "l2",
    category: "logic",
    difficulty: 1,
    prompt: "Аня выше Бори, Боря выше Вики. Кто самый низкий?",
    options: ["Аня", "Боря", "Вика", "Нельзя определить"],
    correct: 2,
  },
  {
    id: "v2",
    category: "verbal",
    difficulty: 1,
    prompt: "Какое слово лишнее?",
    options: ["Яблоко", "Груша", "Морковь", "Слива"],
    correct: 2,
  },
  {
    id: "n3",
    category: "numeric",
    difficulty: 2,
    prompt: "Какое число продолжает ряд: 1, 1, 2, 3, 5, 8, …?",
    options: ["11", "12", "13", "15"],
    correct: 2,
  },
  {
    id: "l3",
    category: "logic",
    difficulty: 2,
    prompt:
      "Если сегодня не понедельник и не выходной, а завтра не пятница, какой день точно исключён сегодня?",
    options: ["Вторник", "Среда", "Четверг", "Ни один из перечисленных"],
    correct: 2,
  },
  {
    id: "v3",
    category: "verbal",
    difficulty: 2,
    prompt: "Книга относится к чтению так же, как вилка — к …",
    options: ["кухне", "еде", "металлу", "ложке"],
    correct: 1,
  },
  {
    id: "n4",
    category: "numeric",
    difficulty: 2,
    prompt: "Какое число продолжает ряд: 81, 27, 9, 3, …?",
    options: ["0", "1", "2", "6"],
    correct: 1,
  },
  {
    id: "l4",
    category: "logic",
    difficulty: 2,
    prompt:
      "В забеге Олег обогнал бегуна, который шёл вторым. На каком месте теперь Олег?",
    options: ["На первом", "На втором", "На третьем", "Нельзя определить"],
    correct: 1,
  },
  {
    id: "v4",
    category: "verbal",
    difficulty: 2,
    prompt: "Какое слово ближе всего по смыслу к слову «лаконичный»?",
    options: ["Краткий", "Яркий", "Строгий", "Вежливый"],
    correct: 0,
  },
  {
    id: "n5",
    category: "numeric",
    difficulty: 2,
    prompt: "Какое число продолжает ряд: 2, 6, 12, 20, 30, …?",
    options: ["36", "40", "42", "44"],
    correct: 2,
  },
  {
    id: "l5",
    category: "logic",
    difficulty: 2,
    prompt:
      "Пять машин делают пять деталей за пять минут. За сколько минут сто машин сделают сто деталей?",
    options: ["1", "5", "20", "100"],
    correct: 1,
  },
  {
    id: "v5",
    category: "verbal",
    difficulty: 2,
    prompt: "Какое слово противоположно по смыслу слову «скудный»?",
    options: ["Редкий", "Обильный", "Тесный", "Простой"],
    correct: 1,
  },
  {
    id: "n6",
    category: "numeric",
    difficulty: 3,
    prompt: "Какое число продолжает ряд: 3, 4, 6, 9, 13, 18, …?",
    options: ["22", "23", "24", "25"],
    correct: 2,
  },
  {
    id: "l6",
    category: "logic",
    difficulty: 3,
    prompt:
      "У Маши столько же братьев, сколько сестёр. У её брата сестёр вдвое больше, чем братьев. Сколько детей в семье?",
    options: ["5", "6", "7", "9"],
    correct: 2,
  },
  {
    id: "v6",
    category: "verbal",
    difficulty: 3,
    prompt: "Симптом относится к болезни так же, как улика — к …",
    options: ["суду", "преступлению", "следователю", "наказанию"],
    correct: 1,
  },
  {
    id: "n7",
    category: "numeric",
    difficulty: 3,
    prompt: "Какое число продолжает ряд: 1, 4, 9, 16, 25, 36, …?",
    options: ["42", "47", "49", "64"],
    correct: 2,
  },
  {
    id: "l7",
    category: "logic",
    difficulty: 3,
    prompt:
      "Бита и мяч вместе стоят 110 рублей. Бита дороже мяча на 100 рублей. Сколько стоит мяч?",
    options: ["5 рублей", "10 рублей", "15 рублей", "100 рублей"],
    correct: 0,
  },
];
