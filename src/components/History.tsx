"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, Tint } from "@/components/ui";

const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });

// График баллов по попыткам: точки соединены линией, последняя выделена.
function Sparkline({ values }: { values: number[] }) {
  const W = 280;
  const H = 72;
  const PAD = 8;
  const min = Math.min(...values) - 5;
  const max = Math.max(...values) + 5;
  const x = (i: number) => PAD + (i / (values.length - 1)) * (W - PAD * 2);
  const y = (v: number) => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="График баллов по попыткам">
      <polyline
        points={points}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-accent"
      />
      {values.map((v, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(v)}
          r={i === values.length - 1 ? 6 : 4}
          strokeWidth="3"
          className={i === values.length - 1 ? "fill-accent stroke-surface" : "fill-surface stroke-accent"}
        />
      ))}
    </svg>
  );
}

// Блок «Ваша динамика» на экране результата.
export function History({ token }: { token: string }) {
  const history = useQuery(api.attempts.history, { token });
  if (!history || history.length === 0) return null;

  // Первая попытка: показываем, зачем возвращаться.
  if (history.length === 1) {
    return (
      <Tint className="animate-rise [animation-delay:200ms]">
        <h2 className="px-1 font-display text-lg font-bold tracking-tight">Ваша динамика</h2>
        <Card className="flex flex-col gap-3">
          <svg viewBox="0 0 280 56" className="w-full opacity-50" aria-hidden>
            <polyline
              points="8,44 76,34 144,38 212,20 272,12"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 9"
              className="stroke-accent"
            />
            <circle cx="8" cy="44" r="6" strokeWidth="3" className="fill-accent stroke-surface" />
          </svg>
          <p className="font-bold">Это ваша первая точка на графике</p>
          <p className="text-muted">
            Мышление тренируется. Вернитесь через пару дней и пройдите тест снова — здесь
            появится ваш прогресс. Повторные попытки уже входят в подписку.
          </p>
        </Card>
      </Tint>
    );
  }

  const last = history[history.length - 1];
  const previous = history[history.length - 2];
  const delta = last.iq - previous.iq;

  return (
    <Tint className="animate-rise [animation-delay:200ms]">
      <h2 className="px-1 font-display text-lg font-bold tracking-tight">Ваша динамика</h2>
      <Card className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-muted">С прошлой попытки</p>
          <p className="font-display text-2xl font-bold tabular-nums text-accent">
            {delta > 0 ? `+${delta}` : delta}
          </p>
        </div>
        <Sparkline values={history.map((h) => h.iq)} />
        <ul className="flex flex-col divide-y divide-border">
          {[...history].reverse().map((h) => (
            <li key={h.finishedAt} className="flex items-center justify-between gap-3 py-2.5">
              <span className={h.current ? "font-bold" : "text-muted"}>
                {dateFormat.format(h.finishedAt)}
                {h.current && " · сейчас"}
              </span>
              <span className="font-bold tabular-nums">{h.iq}</span>
            </li>
          ))}
        </ul>
      </Card>
    </Tint>
  );
}
