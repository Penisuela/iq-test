"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../../convex/_generated/api";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonClass, Card, Screen } from "@/components/ui";
import { errorMessage } from "@/lib/errors";
import { PLAN_KEY, useStored } from "@/lib/storage";
import { useFinishedAttempt } from "@/lib/useAttempt";

export default function CheckoutPage() {
  const router = useRouter();
  const state = useFinishedAttempt();
  const plans = useQuery(api.payments.plans);
  const storedPlan = useStored(PLAN_KEY);
  const checkout = useMutation(api.payments.checkout);
  const track = useMutation(api.events.track);

  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const { token } = state;
  const plan = plans.find((p) => p.id === storedPlan) ?? plans[0];

  async function pay(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await checkout({ token, planId: plan.id, email });
      void track({ name: "payment_success", token });
      router.replace("/result");
    } catch (e) {
      setError(errorMessage(e));
      setPending(false);
    }
  }

  return (
    <Screen>
      <TrackEvent name="checkout_view" />
      <h1 className="text-3xl font-extrabold tracking-tight">Оплата</h1>

      <Card>
        <div className="flex justify-between text-lg font-bold">
          <span>{plan.title}</span>
          <span>{plan.price} ₽</span>
        </div>
        <p className="mt-1 text-sm text-muted">{plan.terms}</p>
      </Card>

      <form onSubmit={pay} className="flex flex-col gap-3">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Email для отправки результата
          <input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 rounded-2xl border border-border bg-surface px-4 text-base outline-none focus:border-accent"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Оплачиваем…" : `Оплатить ${plan.price} ₽`}
        </button>
        <p className="text-center text-xs text-muted">
          Демо-режим: оплата имитируется, деньги не списываются.
        </p>
      </form>
    </Screen>
  );
}
