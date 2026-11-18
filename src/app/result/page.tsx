"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { BellCurve } from "@/components/BellCurve";
import { SkillCard } from "@/components/SkillCard";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonGhostClass, Card, Header, Loading, Screen } from "@/components/ui";
import { iqLevel } from "@/lib/level";
import { TOKEN_KEY, writeStored } from "@/lib/storage";
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
      <p className="font-display text-6xl font-bold tabular-nums tracking-tight">{shown}</p>
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
      <div className="flex flex-col gap-3">
        {categories.map((c) => (
          <SkillCard
            key={c.category}
            title={c.category}
            score={Math.round((c.correct / c.total) * 100)}
            text={`Верных ответов: ${c.correct} из ${c.total}`}
          />
        ))}
      </div>
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
