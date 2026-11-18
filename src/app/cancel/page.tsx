"use client";

import { useMutation } from "convex/react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { api } from "../../../convex/_generated/api";
import { Footer } from "@/components/Footer";
import { CheckIcon } from "@/components/icons";
import {
  buttonClass,
  buttonGhostClass,
  Card,
  Header,
  Tint,
} from "@/components/ui";
import { errorMessage } from "@/lib/errors";

export default function CancelPage() {
  const cancel = useMutation(api.payments.cancelSubscription);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("pending");
    setError(null);
    try {
      await cancel({ email });
      setStatus("done");
    } catch (e) {
      setError(errorMessage(e));
      setStatus("idle");
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pb-16 pt-6 sm:pt-12">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Отмена подписки
          </h1>
          <p className="text-lg text-muted">
            Укажите email, на который была оформлена подписка. Мы сразу отменим
            продление — дальнейших списаний не будет.
          </p>
        </div>

        {status === "done" ? (
          <Tint className="animate-rise">
            <Card className="flex flex-col items-center gap-4 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-accent text-white">
                <CheckIcon className="size-7" />
              </span>
              <p className="text-lg font-bold">Подписка отменена</p>
              <p className="text-muted">
                Если на{" "}
                <span className="font-semibold text-foreground">
                  {email.trim()}
                </span>{" "}
                была оформлена подписка, продление отключено. Доступ к
                результату сохранится до конца оплаченного периода.
              </p>
              <Link href="/" className={buttonGhostClass}>
                На главную
              </Link>
            </Card>
          </Tint>
        ) : (
          <Tint>
            <Card>
              <form onSubmit={submit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-2 text-sm font-semibold">
                  Email
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 w-full rounded-2xl border-2 border-transparent bg-background px-4 text-base font-medium outline-none transition placeholder:font-normal placeholder:text-muted/70 focus:border-accent"
                  />
                </label>
                {error && (
                  <p className="text-sm font-medium text-danger">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={status === "pending"}
                  className={buttonClass}
                >
                  {status === "pending" ? "Отменяем…" : "Отменить подписку"}
                </button>
              </form>
            </Card>
          </Tint>
        )}
      </main>
      <Footer />
    </>
  );
}
