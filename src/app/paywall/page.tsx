"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonClass, Card, Screen } from "@/components/ui";
import { PLAN_KEY, useStored, writeStored } from "@/lib/storage";
import { useFinishedAttempt } from "@/lib/useAttempt";

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
      <Screen>
        <p className="text-muted">Загружаем…</p>
      </Screen>
    );
  }

  const { attempt } = state;
  const planId = plans.some((p) => p.id === storedPlan) ? storedPlan : plans[0].id;
  const minutes = Math.max(1, Math.round((attempt.durationSec ?? 0) / 60));

  return (
    <Screen>
      <TrackEvent name="paywall_view" />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Ваш результат готов</h1>
        <p className="text-muted">
          Вы ответили на {attempt.answered} из {attempt.total} вопросов за {minutes} мин.
        </p>
      </div>

      <Card>
        <p className="text-sm font-medium text-muted">Ваш IQ</p>
        <p aria-hidden className="select-none text-6xl font-extrabold text-border">
          ???
        </p>
      </Card>

      <div className="flex flex-col gap-3">
        {plans.map((plan) => (
          <label
            key={plan.id}
            className={`flex cursor-pointer flex-col gap-1 rounded-2xl border-2 bg-surface p-4 ${
              plan.id === planId ? "border-accent" : "border-border"
            }`}
          >
            <input
              type="radio"
              name="plan"
              className="sr-only"
              checked={plan.id === planId}
              onChange={() => writeStored(PLAN_KEY, plan.id)}
            />
            <span className="flex justify-between text-lg font-bold">
              <span>{plan.title}</span>
              <span>{plan.price} ₽</span>
            </span>
            <span className="text-sm text-muted">{plan.terms}</span>
          </label>
        ))}
      </div>

      <Link
        href="/checkout"
        onClick={() => writeStored(PLAN_KEY, planId ?? null)}
        className={buttonClass}
      >
        Открыть результат
      </Link>
    </Screen>
  );
}
