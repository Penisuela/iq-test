export type Plan = {
  id: string;
  title: string;
  price: number;
  currency: "RUB";
  terms: string;
  recurring: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "trial",
    title: "Пробная неделя",
    price: 49,
    currency: "RUB",
    terms: "49 ₽ за 7 дней, затем 499 ₽ в месяц. Отмена в один клик.",
    recurring: true,
  },
  {
    id: "single",
    title: "Только результат",
    price: 199,
    currency: "RUB",
    terms: "Разовый платёж 199 ₽ без подписки.",
    recurring: false,
  },
];
