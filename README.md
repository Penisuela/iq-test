# IQ-тест

MVP веб-сервиса IQ-тестов с подписочной монетизацией: лендинг → квиз → paywall → checkout → результат.

## Стек

- Next.js (App Router), TypeScript, Tailwind CSS
- Convex — база данных и серверные функции
- Vitest + convex-test — тесты серверной логики

## Запуск

```bash
npm install
npm run dev
```

Команда поднимает Convex и Next.js, приложение откроется на http://localhost:3000.

## Проверки

```bash
npm test
npm run typecheck
npm run lint
```

## Как устроен paywall

- Правильные ответы хранятся только на сервере (`convex/lib/questionBank.ts`) и не попадают в браузер.
- IQ считается на сервере при завершении теста.
- `attempts.result` отдаёт балл только после записи об оплате; `markPaid` — внутренняя функция, с клиента её вызвать нельзя.
- Оплата имитируется: платёж сохраняется в таблицу `payments`, деньги не списываются.
