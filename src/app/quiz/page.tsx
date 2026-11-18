"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { BoostScreen } from "@/components/BoostScreen";
import { Figure } from "@/components/Figure";
import { Matrix } from "@/components/Matrix";
import { Timer } from "@/components/Timer";
import { buttonClass, Header, Loading, ProgressBar, Screen } from "@/components/ui";
import { type Boost, BOOST_MILESTONES, buildBoost } from "@/lib/boost";
import { errorMessage } from "@/lib/errors";
import { readStored, SUBSCRIBER_KEY, TOKEN_KEY, useStored, writeStored } from "@/lib/storage";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
// Пауза, чтобы человек увидел выбранный вариант перед переходом.
const ADVANCE_DELAY_MS = 250;

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
  // Ответы, выбранные в этой сессии: показываем их сразу, не дожидаясь сервера.
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [finishing, setFinishing] = useState(false);
  // Экран поддержки, который сейчас показан вместо вопроса.
  const [boost, setBoost] = useState<Boost | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Попытки с сохранённым токеном больше нет — забываем его и начинаем заново.
  useEffect(() => {
    if (attempt === null) writeStored(TOKEN_KEY, null);
  }, [attempt]);

  useEffect(() => {
    if (token !== null || starting.current || readStored(TOKEN_KEY)) return;
    starting.current = true;
    start({ previousToken: readStored(SUBSCRIBER_KEY) ?? undefined })
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

  const answers: Record<string, number> = {
    ...Object.fromEntries(attempt.answers.map((a) => [a.questionId, a.option])),
    ...picked,
  };
  const answeredCount = questions.filter((q) => q.id in answers).length;
  const allAnswered = answeredCount === questions.length;

  // Открываем первый вопрос без ответа, если страницу перезагрузили.
  const firstUnanswered = questions.findIndex((q) => !(q.id in answers));
  const index = step ?? (firstUnanswered === -1 ? questions.length - 1 : firstUnanswered);
  const question = questions[index];
  const selected = answers[question.id];

  function go(to: number) {
    setStep(to);
    setError(null);
  }

  function choose(option: number) {
    if (!token) return;
    setPicked((prev) => ({ ...prev, [question.id]: option }));
    setError(null);
    answer({ token, questionId: question.id, option }).catch((e) =>
      setError(errorMessage(e)),
    );

    // После 5, 10 и 15 ответов показываем экран поддержки. Повторный ответ на тот же вопрос не считается.
    const answeredNow = question.id in answers ? answeredCount : answeredCount + 1;
    const milestone = BOOST_MILESTONES.find((m) => m === answeredNow && !(question.id in answers));
    if (milestone !== undefined) {
      const startedAt = attempt!.startedAt;
      window.setTimeout(() => {
        const elapsedSec = Math.max(1, (Date.now() - startedAt) / 1000);
        setBoost(buildBoost(milestone, elapsedSec));
      }, ADVANCE_DELAY_MS);
    }

    // Переходим к следующему вопросу без ответа; если такого нет — остаёмся на месте.
    const next = [...questions!.keys()]
      .map((offset) => (index + 1 + offset) % questions!.length)
      .find((i) => i !== index && !(questions![i].id in answers));
    if (next !== undefined) {
      window.setTimeout(() => setStep(next), ADVANCE_DELAY_MS);
    }
  }

  async function complete() {
    if (!token) return;
    setFinishing(true);
    leaving.current = true;
    try {
      await finish({ token });
      void track({ name: "quiz_finish", token });
      router.replace("/analyzing");
    } catch (e) {
      leaving.current = false;
      setFinishing(false);
      setError(errorMessage(e));
    }
  }

  return (
    <>
      <Header>
        <Timer startedAt={attempt.startedAt} />
      </Header>
      <Screen wide>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm font-semibold text-muted">
            <span className="tabular-nums">
              Вопрос {index + 1} из {questions.length}
            </span>
            <span className="tabular-nums">Отвечено: {answeredCount}</span>
          </div>
          <ProgressBar value={(answeredCount / questions.length) * 100} />

          <nav aria-label="Вопросы теста" className="grid grid-cols-10 gap-1 min-[360px]:gap-1.5 md:grid-cols-20">
            {questions.map((q, i) => {
              const isCurrent = i === index;
              const isAnswered = q.id in answers;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Вопрос ${i + 1}${isAnswered ? ", ответ выбран" : ""}`}
                  className={`grid h-9 place-items-center rounded-lg text-xs font-bold tabular-nums transition ${
                    isCurrent
                      ? "bg-accent text-white"
                      : isAnswered
                        ? "bg-accent-soft text-accent"
                        : "bg-surface text-muted"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </nav>
        </div>

        {boost && <BoostScreen boost={boost} onContinue={() => setBoost(null)} />}

        <div
          key={question.id}
          hidden={boost !== null}
          className="flex animate-rise flex-col gap-5 rounded-[2rem] bg-accent-soft p-4 sm:p-6 md:gap-8 md:p-8"
        >
          <h1 className="text-2xl font-extrabold leading-snug tracking-tight md:text-3xl">
            {question.prompt}
          </h1>

          {/* На широком экране матрица стоит слева, варианты ответа — справа. */}
          <div
            className={
              question.matrix ? "flex flex-col gap-5 md:flex-row md:items-center md:gap-8" : ""
            }
          >
            {question.matrix && (
              <div className="mx-auto w-full max-w-[17rem] shrink-0 rounded-3xl bg-surface p-4 md:mx-0 md:max-w-xs">
                <Matrix cells={question.matrix} />
              </div>
            )}

            <div
              className={
                question.matrix
                  ? "grid flex-1 grid-cols-3 gap-3"
                  : "grid gap-3 md:grid-cols-2"
              }
            >
              {question.options.map((option, i) => {
                const isSelected = selected === i;
                const isFigure = typeof option !== "string";
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => choose(i)}
                    aria-pressed={isSelected}
                    aria-label={isFigure ? `Вариант ${LETTERS[i]}` : undefined}
                    className={`rounded-2xl border-2 text-left text-base font-semibold transition active:scale-[0.99] ${
                      isFigure ? "relative p-3" : "flex min-h-16 items-center gap-4 px-4 py-3"
                    } ${
                      isSelected
                        ? "border-accent bg-surface"
                        : "border-transparent bg-surface hover:border-accent/40"
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
        </div>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        {/* Отступ под закреплённую кнопку. */}
        {allAnswered && <div className="h-24" />}
      </Screen>

      {allAnswered && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 animate-rise">
          <div className="mx-auto w-full max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-8">
            <button
              type="button"
              disabled={finishing}
              onClick={complete}
              className={`${buttonClass} pointer-events-auto shadow-[0_14px_30px_-8px_var(--color-accent)]`}
            >
              {finishing ? "Завершаем…" : "Завершить тест"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
