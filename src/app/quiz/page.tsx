"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Card, Screen } from "@/components/ui";
import { errorMessage } from "@/lib/errors";
import { readStored, TOKEN_KEY, useStored, writeStored } from "@/lib/storage";

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
  const [step, setStep] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (starting.current || readStored(TOKEN_KEY)) return;
    starting.current = true;
    start()
      .then(({ token }) => {
        writeStored(TOKEN_KEY, token);
        void track({ name: "quiz_start", token });
      })
      .catch((e) => setError(errorMessage(e)));
  }, [start, track]);

  useEffect(() => {
    if (attempt?.status === "finished") router.replace("/paywall");
  }, [attempt?.status, router]);

  if (!token || !questions || !attempt || attempt.status === "finished") {
    return (
      <Screen>
        <p className="text-muted">{error ?? "Загружаем тест…"}</p>
      </Screen>
    );
  }

  // Продолжаем с первого неотвеченного вопроса, если страницу перезагрузили.
  const index = Math.min(step ?? attempt.answered, questions.length - 1);
  const question = questions[index];

  async function choose(option: number) {
    if (pending || !token) return;
    setPending(true);
    setError(null);
    try {
      await answer({ token, questionId: question.id, option });
      if (index + 1 < questions!.length) {
        setStep(index + 1);
      } else {
        await finish({ token });
        void track({ name: "quiz_finish", token });
        router.replace("/paywall");
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <Screen>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm font-medium text-muted">
          <span>{question.category}</span>
          <span>
            {index + 1} из {questions.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <h1 className="text-xl font-bold leading-snug">{question.prompt}</h1>
      </Card>

      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => (
          <button
            key={`${question.id}-${i}`}
            type="button"
            disabled={pending}
            onClick={() => choose(i)}
            className="min-h-14 rounded-2xl border border-border bg-surface px-5 py-4 text-left text-base font-medium transition active:border-accent active:bg-accent-soft disabled:opacity-60"
          >
            {option}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </Screen>
  );
}
