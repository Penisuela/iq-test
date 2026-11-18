"use client";

import { useEffect, useState } from "react";

// Плавно досчитывает число от стартового значения до целевого.
export function useCountUp(target: number, from: number, durationMs = 1200): number {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.requestAnimationFrame(() => setValue(target));
      return () => window.cancelAnimationFrame(id);
    }
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target, from, durationMs]);

  return value;
}
