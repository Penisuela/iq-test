"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { BellCurve } from "@/components/BellCurve";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonGhostClass, Card, Header, Loading, ProgressBar, Screen } from "@/components/ui";
import { iqLevel } from "@/lib/level";
import { PLAN_KEY, TOKEN_KEY, writeStored } from "@/lib/storage";
import { useCountUp } from "@/lib/useCountUp";
import { useFinishedAttempt } from "@/lib/useAttempt";

type Category = { category: string; correct: number; total: number };

function Score({ iq, percentile }: { iq: number; percentile: number }) {
  const shown = useCountUp(iq, 70);
  const level = iqLevel(iq);

  return (
    <Card className="animate-rise">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-muted">Ваш IQ</p>
        <span className="rounded-full bg-highlight px-3 py-1 text-xs font-bold">{level.title}</span>
      </div>
      <p className="text-7xl font-extrabold tabular-nums tracking-tight">{shown}</p>
      <p className="mb-3 text-muted">
        Выше, чем у <span className="font-bold text-foreground">{percentile}%</span>{" "}
        участников
      </p>
      <BellCurve iq={iq} />
      <p className="mt-4 border-t border-border pt-4 text-muted">{level.text}</p>
    </Card>
  );
}

function Skills({ categories }: { categories: Category[] }) {
  const best = categories.reduce((a, b) =>
    b.correct / b.total > a.correct / a.total ? b : a,
  );

  return (
    <Card className="animate-rise [animation-delay:120ms]">
      <h2 className="text-lg font-bold">Разбор по навыкам</h2>
      <p className="mb-5 mt-1 text-muted">
        Ваша сильная сторона — <span className="font-bold text-foreground">{best.category.toLowerCase()}</span>.
      </p>
      <ul className="flex flex-col gap-5">
        {categories.map((c) => (
          <li key={c.category} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3 font-semibold">
              <span>{c.category}</span>
              <span className="text-sm tabular-nums text-muted">
                {c.correct} из {c.total}
              </span>
            </div>
            <ProgressBar value={(c.correct / c.total) * 100} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const state = useFinishedAttempt();
  const result = useQuery(
    api.attempts.result,
    state ? { token: state.token } : "skip",
  );

  useEffect(() => {
    if (result?.locked) router.replace("/paywall");
  }, [result?.locked, router]);

  if (!result || result.locked) {
    return (
      <>
        <Header />
        <Loading label="Загружаем результат…" />
      </>
    );
  }

  function retake() {
    writeStored(PLAN_KEY, null);
    writeStored(TOKEN_KEY, null);
    router.push("/quiz");
  }

  return (
    <>
      <Header />
      <Screen>
        <TrackEvent name="result_view" />
        <Score iq={result.iq} percentile={result.percentile} />
        <Skills categories={result.categories} />
        <button type="button" onClick={retake} className={buttonGhostClass}>
          Пройти тест заново
        </button>
        <p className="text-center text-xs text-muted">
          Результат ознакомительный и не является психологическим заключением.
        </p>
      </Screen>
    </>
  );
}
