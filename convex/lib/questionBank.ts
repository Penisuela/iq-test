// Банк вопросов живёт только на сервере: поле `correct` не уходит в браузер.

export type Category = "logic" | "numeric" | "verbal";

export type Shape = "circle" | "square" | "triangle" | "diamond";
export type Fill = "outline" | "tint" | "solid";

// Клетка матрицы: фигура, заливка, количество фигур и поворот в градусах.
export type Cell = { shape: Shape; fill: Fill; count: number; rotation: number };

export type Question = {
  id: string;
  category: Category;
  difficulty: 1 | 2 | 3;
  prompt: string;
  // Для заданий с фигурами: 9 клеток по строкам, null — пропущенная.
  matrix?: (Cell | null)[];
  options: (string | Cell)[];
  correct: number;
};

const cell = (shape: Shape, fill: Fill, count = 1, rotation = 0): Cell => ({
  shape,
  fill,
  count,
  rotation,
});

const MATRIX_PROMPT = "Какой фигуры не хватает?";

export const CATEGORY_LABELS: Record<Category, string> = {
  logic: "Логика",
  numeric: "Числа",
  verbal: "Вербальное мышление",
};

// Первый вопрос показывается на главной как «Попробуйте первое задание».
export const QUESTIONS: Question[] = [
  {
    id: "m1",
    category: "logic",
    difficulty: 1,
    prompt: MATRIX_PROMPT,
    // Фигура задаётся строкой, заливка — столбцом.
    matrix: [
      cell("circle", "outline"), cell("circle", "tint"), cell("circle", "solid"),
      cell("square", "outline"), cell("square", "tint"), cell("square", "solid"),
      cell("triangle", "outline"), cell("triangle", "tint"), null,
    ],
    options: [
      cell("triangle", "outline"),
      cell("square", "solid"),
      cell("triangle", "solid"),
      cell("circle", "solid"),
      cell("triangle", "tint"),
      cell("diamond", "solid"),
    ],
    correct: 2,
  },
  {
    id: "n1",
    category: "numeric",
    difficulty: 1,
    prompt: "Какое число продолжает ряд: 2, 4, 8, 16, …?",
    options: ["20", "24", "30", "32"],
    correct: 3,
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
    id: "l2",
    category: "logic",
    difficulty: 1,
    prompt: "Аня выше Бори, Боря выше Вики. Кто самый низкий?",
    options: ["Аня", "Боря", "Вика", "Нельзя определить"],
    correct: 2,
  },
  {
    id: "m2",
    category: "logic",
    difficulty: 1,
    prompt: MATRIX_PROMPT,
    // Количество фигур растёт слева направо.
    matrix: [
      cell("circle", "solid", 1), cell("circle", "solid", 2), cell("circle", "solid", 3),
      cell("square", "solid", 1), cell("square", "solid", 2), cell("square", "solid", 3),
      cell("diamond", "solid", 1), cell("diamond", "solid", 2), null,
    ],
    options: [
      cell("diamond", "solid", 3),
      cell("diamond", "solid", 2),
      cell("square", "solid", 3),
      cell("diamond", "outline", 3),
      cell("circle", "solid", 3),
      cell("diamond", "solid", 1),
    ],
    correct: 0,
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
    id: "m3",
    category: "logic",
    difficulty: 2,
    prompt: MATRIX_PROMPT,
    // Треугольник поворачивается на 90° в каждом столбце, заливка задаётся строкой.
    matrix: [
      cell("triangle", "outline", 1, 0), cell("triangle", "outline", 1, 90), cell("triangle", "outline", 1, 180),
      cell("triangle", "tint", 1, 0), cell("triangle", "tint", 1, 90), cell("triangle", "tint", 1, 180),
      cell("triangle", "solid", 1, 0), cell("triangle", "solid", 1, 90), null,
    ],
    options: [
      cell("triangle", "solid", 1, 0),
      cell("triangle", "tint", 1, 180),
      cell("triangle", "solid", 1, 270),
      cell("triangle", "solid", 1, 180),
      cell("triangle", "solid", 1, 90),
      cell("triangle", "outline", 1, 180),
    ],
    correct: 3,
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
    id: "m4",
    category: "logic",
    difficulty: 2,
    prompt: MATRIX_PROMPT,
    // В каждой строке и каждом столбце каждая фигура и каждая заливка встречаются по одному разу.
    matrix: [
      cell("circle", "outline"), cell("square", "tint"), cell("triangle", "solid"),
      cell("square", "solid"), cell("triangle", "outline"), cell("circle", "tint"),
      cell("triangle", "tint"), cell("circle", "solid"), null,
    ],
    options: [
      cell("square", "tint"),
      cell("square", "outline"),
      cell("circle", "outline"),
      cell("triangle", "outline"),
      cell("square", "solid"),
      cell("diamond", "outline"),
    ],
    correct: 1,
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
    id: "v6",
    category: "verbal",
    difficulty: 3,
    prompt: "Симптом относится к болезни так же, как улика — к …",
    options: ["суду", "преступлению", "следователю", "наказанию"],
    correct: 1,
  },
  {
    id: "m5",
    category: "logic",
    difficulty: 3,
    prompt: MATRIX_PROMPT,
    // В третьем столбце столько фигур, сколько в первых двух вместе.
    matrix: [
      cell("circle", "outline", 1), cell("circle", "outline", 1), cell("circle", "solid", 2),
      cell("square", "outline", 1), cell("square", "outline", 2), cell("square", "solid", 3),
      cell("triangle", "outline", 2), cell("triangle", "outline", 1), null,
    ],
    options: [
      cell("triangle", "solid", 2),
      cell("triangle", "outline", 3),
      cell("square", "solid", 3),
      cell("triangle", "solid", 1),
      cell("triangle", "solid", 3),
      cell("circle", "solid", 3),
    ],
    correct: 4,
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
  {
    id: "m6",
    category: "logic",
    difficulty: 3,
    prompt: MATRIX_PROMPT,
    // Количество задаётся строкой, фигура — столбцом, заливки в строках и столбцах не повторяются.
    matrix: [
      cell("circle", "outline", 1), cell("square", "tint", 1), cell("diamond", "solid", 1),
      cell("circle", "tint", 2), cell("square", "solid", 2), cell("diamond", "outline", 2),
      cell("circle", "solid", 3), cell("square", "outline", 3), null,
    ],
    options: [
      cell("diamond", "solid", 3),
      cell("diamond", "tint", 2),
      cell("square", "tint", 3),
      cell("diamond", "outline", 3),
      cell("circle", "tint", 3),
      cell("diamond", "tint", 3),
    ],
    correct: 5,
  },
];
