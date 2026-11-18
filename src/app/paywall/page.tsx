"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { BellCurve } from "@/components/BellCurve";
import { CheckIcon, LockIcon } from "@/components/icons";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonClass, Card, Header, Loading, Screen, Tint } from "@/components/ui";
import { formatDuration } from "@/lib/level";
import { useFinishedAttempt } from "@/lib/useAttempt";

const INCLUDED = [
  "Точный балл IQ по шкале со средним 100",
  "Ваше место среди других участников",
  "Разбор по трём навыкам мышления",
  "Пояснение, что значит ваш результат",
  "Повторные попытки без доплаты, пока активна подписка",
];

export default function PaywallPage() {
  const router = useRouter();
  const state = useFinishedAttempt();
  const offer = useQuery(api.payments.offer);

  useEffect(() => {
    if (state?.attempt.paid) router.replace("/result");
  }, [state?.attempt.paid, router]);

  if (!state || !offer || state.attempt.paid) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  const { attempt } = state;

  return (
    <>
      <Header />
      <Screen>
        <TrackEvent name="paywall_view" />

        <div className="flex animate-rise flex-col gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight">Ваш результат готов</h1>
          <p className="text-muted">
            Вы ответили на {attempt.answered} из {attempt.total} вопросов за{" "}
            {formatDuration(attempt.durationSec ?? 0)}.
          </p>
        </div>

        <Tint className="animate-rise [animation-delay:80ms]">
          <Card className="relative overflow-hidden">
            <p className="text-sm font-semibold text-muted">Ваш IQ</p>
            {/* Заглушка: настоящий балл в браузер до оплаты не передаётся. */}
            <p
              aria-hidden
              className="select-none font-display text-5xl font-bold tracking-tight text-accent blur-md"
            >
              000
            </p>
            <div className="mt-2 opacity-60">
              <BellCurve />
            </div>
            <div className="absolute inset-0 grid place-items-center bg-surface/40">
              <span className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_var(--color-accent)]">
                <LockIcon className="size-4" />
                Результат скрыт
              </span>
            </div>
          </Card>
        </Tint>

        <Tint className="gap-5 sm:p-6">
          <h2 className="px-1 font-display text-lg font-bold tracking-tight">Что вы получите</h2>
          <ul className="flex flex-col gap-4 px-1">
            {INCLUDED.map((label) => (
              <li key={label} className="flex gap-3 font-medium">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                  <CheckIcon className="size-3.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </Tint>

        {/* Отступ под закреплённую кнопку. */}
        <div className="h-24" />
      </Screen>

      <div className="fixed inset-x-0 bottom-0 bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <Link href="/checkout" className={buttonClass}>
            Открыть результат за {offer.price} ₽
          </Link>
          <p className="text-center text-sm text-muted">{offer.terms}</p>
        </div>
      </div>
    </>
  );
}
