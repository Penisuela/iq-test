"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "@/components/icons";
import { formatDuration } from "@/lib/level";

export function Timer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, 1000);
    const first = window.setTimeout(tick, 0);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(first);
    };
  }, []);

  const elapsed = now === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));

  return (
    <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold tabular-nums">
      <ClockIcon />
      {formatDuration(elapsed)}
    </span>
  );
}
