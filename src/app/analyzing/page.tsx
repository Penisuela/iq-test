"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/icons";
import { Header, Loading, ProgressBar, Screen } from "@/components/ui";
import { useFinishedAttempt } from "@/lib/useAttempt";

const STAGES = [
  "Проверяем ответы",
  "Оцениваем логику",
  "Оцениваем работу с числами",
  "Оцениваем вербальное мышление",
  "Сравниваем с другими участниками",
];
const STAGE_MS = 800;

export default function AnalyzingPage() {
  const router = useRouter();
  const state = useFinishedAttempt();
  const [done, setDone] = useState(0);
  const ready = state !== null;

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => setDone((n) => n + 1), STAGE_MS);
    return () => window.clearInterval(id);
  }, [ready]);

  useEffect(() => {
    if (done > STAGES.length) router.replace("/paywall");
  }, [done, router]);

  if (!state) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  const percent = Math.round((Math.min(done, STAGES.length) / STAGES.length) * 100);

  return (
    <>
      <Header />
      <Screen>
        <div className="flex flex-1 flex-col justify-center gap-8 py-10">
          <div className="flex flex-col gap-3">
            <p className="font-display text-5xl font-bold tabular-nums tracking-tight">{percent}%</p>
            <h1 className="font-display text-xl font-bold tracking-tight">Считаем ваш результат</h1>
            <ProgressBar value={percent} />
          </div>

          <ul className="flex flex-col gap-4">
            {STAGES.map((stage, i) => {
              const isDone = i < done;
              const isActive = i === done;
              return (
                <li
                  key={stage}
                  className={`flex items-center gap-3 font-semibold transition ${
                    isDone || isActive ? "text-foreground" : "text-muted/60"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full transition ${
                      isDone
                        ? "bg-foreground text-highlight"
                        : isActive
                          ? "border-2 border-border border-t-foreground motion-safe:animate-spin"
                          : "border-2 border-border"
                    }`}
                  >
                    {isDone && <CheckIcon className="size-4" />}
                  </span>
                  {stage}
                </li>
              );
            })}
          </ul>
        </div>
      </Screen>
    </>
  );
}
