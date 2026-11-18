"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { TrackEvent } from "@/components/TrackEvent";
import { Card, Screen } from "@/components/ui";
import { useFinishedAttempt } from "@/lib/useAttempt";

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
      <Screen>
        <p className="text-muted">Загружаем результат…</p>
      </Screen>
    );
  }

  return (
    <Screen>
      <TrackEvent name="result_view" />
      <Card>
        <p className="text-sm font-medium text-muted">Ваш IQ</p>
        <p className="text-7xl font-extrabold text-accent">{result.iq}</p>
        <p className="mt-2 text-muted">
          Выше, чем у {result.percentile}% участников.
        </p>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold">Разбор по навыкам</h2>
        <ul className="flex flex-col gap-4">
          {result.categories.map((c) => (
            <li key={c.category} className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{c.category}</span>
                <span className="text-muted">
                  {c.correct} из {c.total}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(c.correct / c.total) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </Screen>
  );
}
