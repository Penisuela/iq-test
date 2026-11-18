"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../../convex/_generated/api";
import { BackIcon, CheckIcon, LockIcon } from "@/components/icons";
import { EmailField, emailError } from "@/components/EmailField";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonClass, Card, Header, Loading, Screen, Tint } from "@/components/ui";
import { errorMessage } from "@/lib/errors";
import { useFinishedAttempt } from "@/lib/useAttempt";

const fieldBase =
  "h-14 w-full rounded-2xl border-2 border-transparent px-4 text-base font-medium outline-none transition";
const demoFieldClass = `${fieldBase} bg-surface/60 text-muted`;
const SUCCESS_DELAY_MS = 900;

export default function CheckoutPage() {
  const router = useRouter();
  const state = useFinishedAttempt();
  const offer = useQuery(api.payments.offer);
  const checkout = useMutation(api.payments.checkout);
  const track = useMutation(api.events.track);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const paid = state?.attempt.paid;
  useEffect(() => {
    if (!paid) return;
    // Если оплата прошла только что, даём увидеть подтверждение.
    const id = window.setTimeout(
      () => router.replace("/result"),
      status === "idle" ? 0 : SUCCESS_DELAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [paid, status, router]);

  if (!state || !offer || (paid && status === "idle")) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  const { token } = state;

  async function pay(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (emailError(email)) return;
    setStatus("pending");
    setError(null);
    try {
      await checkout({ token, email });
      void track({ name: "payment_success", token });
      setStatus("success");
    } catch (e) {
      setError(errorMessage(e));
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <>
        <Header />
        <Screen>
          <div className="flex flex-1 animate-rise flex-col items-center justify-center gap-4 py-24 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-accent text-white">
              <CheckIcon className="size-8" />
            </span>
            <h1 className="font-display text-xl font-bold tracking-tight">Оплата прошла</h1>
            <p className="text-muted">Открываем ваш результат…</p>
          </div>
        </Screen>
      </>
    );
  }

  return (
    <>
      <Header />
      <Screen>
        <TrackEvent name="checkout_view" />

        <Link
          href="/paywall"
          className="-my-3 flex items-center gap-2 self-start py-3 text-sm font-semibold text-muted transition hover:text-foreground"
        >
          <BackIcon className="size-4" />
          Назад
        </Link>

        <h1 className="font-display text-2xl font-bold tracking-tight">Оплата</h1>

        <Tint>
          <Card>
            <div className="flex items-baseline justify-between gap-3 text-lg font-bold">
              <span>{offer.title}</span>
              <span className="text-accent">{offer.price} ₽</span>
            </div>
            <p className="mt-1 text-sm text-muted">{offer.terms}</p>
          </Card>
        </Tint>

        <form onSubmit={pay} noValidate className="flex flex-col gap-4 rounded-[2rem] bg-accent-soft p-4 sm:p-6">
          <EmailField
            value={email}
            onChange={setEmail}
            showError={submitted}
            hint="Пришлём сюда результат и чек."
          />

          <div className="flex flex-col gap-2 text-sm font-semibold">
            <span className="flex items-center justify-between">
              Карта
              <span className="rounded-full bg-highlight px-2.5 py-0.5 text-xs font-bold">
                Демо
              </span>
            </span>
            <input
              readOnly
              tabIndex={-1}
              aria-label="Номер демо-карты"
              value="4242 4242 4242 4242"
              className={demoFieldClass}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                readOnly
                tabIndex={-1}
                aria-label="Срок действия демо-карты"
                value="12 / 30"
                className={demoFieldClass}
              />
              <input
                readOnly
                tabIndex={-1}
                aria-label="Код демо-карты"
                value="•••"
                className={demoFieldClass}
              />
            </div>
            <span className="font-normal text-muted">
              Это демонстрация: тестовая карта подставлена автоматически, деньги не
              списываются.
            </span>
          </div>

          {error && <p className="text-sm font-medium text-danger">{error}</p>}

          <button type="submit" disabled={status === "pending"} className={buttonClass}>
            <LockIcon className="size-4" />
            {status === "pending" ? "Оплачиваем…" : `Оплатить ${offer.price} ₽`}
          </button>
        </form>
      </Screen>
    </>
  );
}
