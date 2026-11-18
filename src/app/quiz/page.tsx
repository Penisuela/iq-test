"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Figure } from "@/components/Figure";
import { BackIcon } from "@/components/icons";
import { Matrix } from "@/components/Matrix";
import { Timer } from "@/components/Timer";
import { Header, Loading, ProgressBar, Screen } from "@/components/ui";
import { errorMessage } from "@/lib/errors";
import { readStored, TOKEN_KEY, useStored, writeStored } from "@/lib/storage";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
// Пауза, чтобы человек увидел выбранный вариант перед переходом.
const ADVANCE_DELAY_MS = 220;

export default function QuizPage() {
  const router = useRouter();
  const token = useStored(TOKEN_KEY);
  const questions = useQuery(api.questions.list);
  const attempt = useQuery(api.attempts.paywall, token ? { token } : "skip");
  const start = useMutation(api.attempts.start);
  const answer = useMutation(api.attempts.answer);
  const finish = useMutation(api.attempts.finish);
  const track = useMutation(api.events.track);

  const starting = useRef(false);
  const leaving = useRef(false);
  const [step, setStep] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Попытки с сохранённым токеном больше нет — забываем его и начинаем заново.
  useEffect(() => {
    if (attempt === null) writeStored(TOKEN_KEY, null);
  }, [attempt]);

  useEffect(() => {
    if (token !== null || starting.current || readStored(TOKEN_KEY)) return;
    starting.current = true;
    start()
      .then(({ token }) => {
        writeStored(TOKEN_KEY, token);
        void track({ name: "quiz_start", token });
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => {
        starting.current = false;
      });
  }, [token, start, track]);

  useEffect(() => {
    if (attempt?.status === "finished" && !leaving.current) {
      router.replace("/paywall");
    }
  }, [attempt?.status, router]);

  if (!token || !questions || !attempt || attempt.status === "finished") {
    return (
      <>
        <Header />
        <Loading label={error ?? "Загружаем тест…"} />
      </>
    );
  }

  // Продолжаем с первого неотвеченного вопроса, если страницу перезагрузили.
  const index = Math.min(step ?? attempt.answered, questions.length - 1);
  const question = questions[index];
  const isLast = index + 1 === questions.length;

  async function choose(option: number) {
    if (selected !== null || !token) return;
    setSelected(option);
    setError(null);
    try {
      await Promise.all([
        answer({ token, questionId: question.id, option }),
        new Promise((resolve) => setTimeout(resolve, ADVANCE_DELAY_MS)),
      ]);
      if (isLast) {
        leaving.current = true;
        await finish({ token });
        void track({ name: "quiz_finish", token });
        router.replace("/analyzing");
        return;
      }
      setStep(index + 1);
    } catch (e) {
      setError(errorMessage(e));
    }
    setSelected(null);
  }

  return (
    <>
      <Header>
        <Timer startedAt={attempt.startedAt} />
      </Header>
      <Screen>
        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-semibold tabular-nums text-muted">
            Вопрос {index + 1} из {questions.length}
          </p>
          <ProgressBar value={((index + 1) / questions.length) * 100} />
        </div>

        <div key={question.id} className="flex animate-rise flex-col gap-5">
          <h1 className="py-3 text-2xl font-extrabold leading-snug tracking-tight">
            {question.prompt}
          </h1>

          {question.matrix && (
            <div className="mx-auto w-full max-w-[17rem] rounded-3xl border border-border bg-surface p-4">
              <Matrix cells={question.matrix} />
            </div>
          )}

          <div className={question.matrix ? "grid grid-cols-3 gap-3" : "flex flex-col gap-3"}>
            {question.options.map((option, i) => {
              const isSelected = selected === i;
              const isFigure = typeof option !== "string";
              return (
                <button
                  key={i}
                  type="button"
                  disabled={selected !== null}
                  onClick={() => choose(i)}
                  aria-label={isFigure ? `Вариант ${LETTERS[i]}` : undefined}
                  className={`rounded-2xl border-2 text-left text-base font-semibold transition active:scale-[0.99] ${
                    isFigure
                      ? "relative p-3"
                      : "flex min-h-16 items-center gap-4 px-4 py-3"
                  } ${
                    isSelected
                      ? "border-accent bg-accent-soft"
                      : "border-transparent bg-surface shadow-[0_0_0_1px_var(--color-border)] hover:shadow-[0_0_0_1px_var(--color-foreground)]"
                  }`}
                >
                  <span
                    className={`grid shrink-0 place-items-center font-extrabold transition ${
                      isFigure
                        ? "absolute left-2 top-2 size-6 rounded-lg text-xs"
                        : "size-9 rounded-xl text-sm"
                    } ${isSelected ? "bg-accent text-white" : "bg-background text-muted"}`}
                  >
                    {LETTERS[i]}
                  </span>
                  {isFigure ? <Figure cell={option} className="mx-auto w-4/5" /> : option}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        {index > 0 && (
          <button
            type="button"
            disabled={selected !== null}
            onClick={() => setStep(index - 1)}
            className="mt-auto flex items-center gap-2 self-start py-2 text-sm font-semibold text-muted transition hover:text-foreground disabled:opacity-50"
          >
            <BackIcon className="size-4" />
            Предыдущий вопрос
          </button>
        )}
      </Screen>
    </>
  );
}
