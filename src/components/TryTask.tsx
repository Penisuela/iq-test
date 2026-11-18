"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Figure, type FigureCell } from "@/components/Figure";
import { Matrix } from "@/components/Matrix";
import { readStored, SUBSCRIBER_KEY, TOKEN_KEY, useStored, writeStored } from "@/lib/storage";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// Первое задание теста прямо на главной: ответ засчитывается, и тест продолжается со второго вопроса.
export function TryTask({
  questionId,
  matrix,
  options,
}: {
  questionId: string;
  matrix: (FigureCell | null)[];
  options: FigureCell[];
}) {
  const router = useRouter();
  const start = useMutation(api.attempts.start);
  const answer = useMutation(api.attempts.answer);
  const track = useMutation(api.events.track);
  const storedToken = useStored(TOKEN_KEY);
  const attempt = useQuery(api.attempts.paywall, storedToken ? { token: storedToken } : "skip");
  const [selected, setSelected] = useState<number | null>(null);
  // Пока не знаем, есть ли у человека попытка и в каком она состоянии, клики не принимаем.
  const ready = storedToken !== undefined && (!storedToken || attempt !== undefined);

  async function choose(option: number) {
    if (selected !== null || !ready) return;
    setSelected(option);
    void track({ name: "cta_click", source: "task" });
    // Оплаченный результат не затираем: показываем его.
    if (attempt?.paid) {
      router.push("/result");
      return;
    }
    try {
      // Продолжаем только незавершённую попытку. Если прошлый тест уже пройден
      // (или попытки больше нет), начинаем новый — человек хочет пройти заново.
      let token = attempt?.status === "in_progress" ? storedToken : null;
      if (!token) {
        token = (await start({ previousToken: readStored(SUBSCRIBER_KEY) ?? undefined })).token;
        writeStored(TOKEN_KEY, token);
        void track({ name: "quiz_start", token });
      }
      await answer({ token, questionId, option });
    } catch {
      // Страница теста сама разберётся с состоянием попытки.
    }
    router.push("/quiz");
  }

  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-surface p-5 md:p-8">
      <p className="text-xl font-extrabold tracking-tight">Какой фигуры не хватает?</p>
      {/* На широком экране варианты ответа растягиваются на высоту таблицы. */}
      <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-8">
        <div className="mx-auto w-full max-w-[16rem] shrink-0 md:mx-0 md:w-72 md:max-w-none">
          <Matrix cells={matrix} />
        </div>
        {/* На телефоне варианты идут под таблицей — отделяем их подписью и линией, чтобы не сливались. */}
        <p className="-mb-2 border-t border-border pt-5 text-sm font-bold text-muted md:hidden">
          Выберите ответ
        </p>
        <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-3">
          {options.map((option, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                type="button"
                disabled={selected !== null}
                onClick={() => choose(i)}
                aria-label={`Вариант ${LETTERS[i]}`}
                className={`relative grid place-items-center rounded-2xl border-2 p-1 transition md:p-3 active:scale-[0.98] ${
                  isSelected
                    ? "border-accent bg-accent-soft"
                    : "border-border bg-surface hover:border-accent/50 md:border-transparent md:bg-background"
                }`}
              >
                <span
                  className={`absolute left-1 top-1 grid size-5 place-items-center rounded-md text-[10px] font-extrabold md:left-2 md:top-2 md:size-6 md:rounded-lg md:text-xs ${
                    isSelected ? "bg-accent text-white" : "bg-background text-muted md:bg-surface"
                  }`}
                >
                  {LETTERS[i]}
                </span>
                <Figure cell={option} className="w-full md:w-24" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
