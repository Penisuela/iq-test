"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { BellCurve } from "@/components/BellCurve";
import { ArrowIcon, CheckIcon, LockIcon } from "@/components/icons";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonClass, Card, Header, Loading, Screen } from "@/components/ui";
import { formatDuration } from "@/lib/level";
import { PLAN_KEY, useStored, writeStored } from "@/lib/storage";
import { useFinishedAttempt } from "@/lib/useAttempt";

const INCLUDED = [
  "Точный балл IQ по шкале со средним 100",
  "Ваше место среди других участников",
  "Разбор по трём навыкам мышления",
  "Пояснение, что значит ваш результат",
];

export default function PaywallPage() {
  const router = useRouter();
  const state = useFinishedAttempt();
  const plans = useQuery(api.payments.plans);
  const storedPlan = useStored(PLAN_KEY);

  useEffect(() => {
    if (state?.attempt.paid) router.replace("/result");
  }, [state?.attempt.paid, router]);

  if (!state || !plans || state.attempt.paid) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  const { attempt } = state;
  const plan = plans.find((p) => p.id === storedPlan) ?? plans[0];

  return (
    <>
      <Header />
      <Screen>
        <TrackEvent name="paywall_view" />

        <div className="flex animate-rise flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Ваш результат готов</h1>
          <p className="text-muted">
            Вы ответили на {attempt.answered} из {attempt.total} вопросов за{" "}
            {formatDuration(attempt.durationSec ?? 0)}.
          </p>
        </div>

        <Card className="relative animate-rise overflow-hidden [animation-delay:80ms]">
          <p className="text-sm font-semibold text-muted">Ваш IQ</p>
          {/* Заглушка: настоящий балл в браузер до оплаты не передаётся. */}
          <p aria-hidden className="select-none text-6xl font-extrabold tracking-tight blur-md">
            000
          </p>
          <div className="mt-2 opacity-60">
            <BellCurve />
          </div>
          <div className="absolute inset-0 grid place-items-center bg-surface/40">
            <span className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-bold text-white shadow-lg">
              <LockIcon className="size-4 text-highlight" />
              Результат скрыт
            </span>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-bold">Что вы получите</h2>
          <ul className="flex flex-col gap-2.5">
            {INCLUDED.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-lg font-bold">Выберите тариф</legend>
          {plans.map((p) => {
            const active = p.id === plan.id;
            return (
              <label
                key={p.id}
                className={`flex cursor-pointer gap-3 rounded-2xl border-2 bg-surface p-4 transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent ${
                  active ? "border-accent" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  className="sr-only"
                  checked={active}
                  onChange={() => writeStored(PLAN_KEY, p.id)}
                />
                <span
                  className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                    active ? "border-accent" : "border-border"
                  }`}
                >
                  {active && <span className="size-2.5 rounded-full bg-accent" />}
                </span>
                <span className="flex flex-1 flex-col gap-1">
                  <span className="flex items-baseline justify-between gap-3 text-lg font-bold">
                    <span>{p.title}</span>
                    <span>{p.price} ₽</span>
                  </span>
                  <span className="text-sm text-muted">{p.terms}</span>
                </span>
              </label>
            );
          })}
        </fieldset>

        {/* Отступ под закреплённую кнопку. */}
        <div className="h-24" />
      </Screen>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <Link
            href="/checkout"
            onClick={() => writeStored(PLAN_KEY, plan.id)}
            className={buttonClass}
          >
            Открыть результат за {plan.price} ₽
            <ArrowIcon />
          </Link>
          <p className="text-center text-xs text-muted">{plan.terms}</p>
        </div>
      </div>
    </>
  );
}
