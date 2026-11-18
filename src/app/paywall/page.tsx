"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { BellCurve } from "@/components/BellCurve";
import {
  ArrowIcon,
  ChartIcon,
  ListIcon,
  LockIcon,
  LogicIcon,
  SparkIcon,
} from "@/components/icons";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonClass, Card, Header, Loading, Screen } from "@/components/ui";
import { formatDuration } from "@/lib/level";
import { useFinishedAttempt } from "@/lib/useAttempt";

const INCLUDED = [
  { icon: SparkIcon, label: "Точный балл IQ по шкале со средним 100" },
  { icon: ChartIcon, label: "Ваше место среди других участников" },
  { icon: LogicIcon, label: "Разбор по трём навыкам мышления" },
  { icon: ListIcon, label: "Пояснение, что значит ваш результат" },
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

        <Card className="relative animate-rise overflow-hidden [animation-delay:80ms]">
          <p className="text-sm font-semibold text-muted">Ваш IQ</p>
          {/* Заглушка: настоящий балл в браузер до оплаты не передаётся. */}
          <p aria-hidden className="select-none font-display text-5xl font-bold tracking-tight blur-md">
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
          <ul className="flex flex-col gap-3">
            {INCLUDED.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 font-medium">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </Card>

        {/* Отступ под закреплённую кнопку. */}
        <div className="h-24" />
      </Screen>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <Link href="/checkout" className={buttonClass}>
            Открыть результат за {offer.price} ₽
            <ArrowIcon />
          </Link>
          <p className="text-center text-sm text-muted">{offer.terms}</p>
        </div>
      </div>
    </>
  );
}
