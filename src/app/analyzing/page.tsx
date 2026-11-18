"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import heroImage from "../../../public/images/hero.png";
import { CheckIcon } from "@/components/icons";
import { Header, Loading, ProgressBar, Screen, Tint } from "@/components/ui";
import { useFinishedAttempt } from "@/lib/useAttempt";

const STAGES = [
  "Проверяем ответы",
  "Оцениваем логику",
  "Оцениваем работу с числами",
  "Оцениваем вербальное мышление",
  "Сравниваем с другими участниками",
];
// Вся шкала заполняется равномерно за это время; этапы отмечаются по мере прохождения.
const DURATION_MS = 4500;

export default function AnalyzingPage() {
  const router = useRouter();
  const state = useFinishedAttempt();
  // Доля от 0 до 1, обновляется каждый кадр — шкала идёт плавно, без скачков.
  const [progress, setProgress] = useState(0);
  const ready = state !== null;

  useEffect(() => {
    if (!ready) return;
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const value = Math.min(1, (now - startedAt) / DURATION_MS);
      setProgress(value);
      if (value < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [ready]);

  useEffect(() => {
    if (progress < 1) return;
    // Короткая пауза на 100%, чтобы человек увидел завершение.
    const id = window.setTimeout(() => router.replace("/paywall"), 400);
    return () => window.clearTimeout(id);
  }, [progress, router]);

  if (!state) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  const percent = Math.round(progress * 100);
  const done = Math.min(STAGES.length, Math.floor(progress * STAGES.length));

  return (
    <>
      <Header />
      <Screen>
        <Tint className="my-auto gap-6 sm:p-8">
          <Image
            src={heroImage}
            alt=""
            sizes="224px"
            priority
            className="mx-auto h-auto w-56"
          />
          <div className="flex flex-col gap-3">
            <p className="font-display text-5xl font-bold tabular-nums tracking-tight text-accent">
              {percent}%
            </p>
            <h1 className="font-display text-xl font-bold tracking-tight">Считаем ваш результат</h1>
            <ProgressBar value={progress * 100} smooth={false} />
          </div>

          <ul className="flex flex-col gap-3 rounded-3xl bg-surface p-5">
            {STAGES.map((stage, i) => {
              const isDone = i < done;
              const isActive = i === done;
              return (
                <li
                  key={stage}
                  className={`flex items-center gap-3 font-semibold transition ${
                    isDone || isActive ? "" : "text-muted/60"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full transition ${
                      isDone
                        ? "bg-accent text-white"
                        : isActive
                          ? "border-2 border-accent-soft border-t-accent motion-safe:animate-spin"
                          : "border-2 border-accent-soft"
                    }`}
                  >
                    {isDone && <CheckIcon className="size-4" />}
                  </span>
                  {stage}
                </li>
              );
            })}
          </ul>
        </Tint>
      </Screen>
    </>
  );
}
