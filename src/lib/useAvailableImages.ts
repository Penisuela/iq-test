import { useEffect, useState } from "react";

// Заранее проверяет, какие картинки существуют. Экран, который их показывает,
// сразу знает, оставлять ли под картинку место, и не меняет высоту после появления.
export function useAvailableImages(sources: readonly string[]): ReadonlySet<string> {
  const [available, setAvailable] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    let active = true;
    for (const src of sources) {
      const probe = new window.Image();
      probe.onload = () => {
        if (active) setAvailable((current) => new Set(current).add(src));
      };
      probe.src = src;
    }
    return () => {
      active = false;
    };
  }, [sources]);

  return available;
}
