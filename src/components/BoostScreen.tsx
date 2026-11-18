"use client";

import Image from "next/image";
import { useState } from "react";
import type { Boost } from "@/lib/boost";
import { buttonClass } from "@/components/ui";

// Экран поддержки между вопросами. Иллюстрация необязательна: если файла нет, блок просто без неё.
export function BoostScreen({ boost, onContinue }: { boost: Boost; onContinue: () => void }) {
  const [hasImage, setHasImage] = useState(true);

  return (
    <div className="flex animate-rise flex-col items-center gap-5 rounded-[2rem] bg-accent-soft p-6 text-center sm:p-10">
      {hasImage && (
        <Image
          src={boost.image}
          alt=""
          width={600}
          height={600}
          sizes="224px"
          onError={() => setHasImage(false)}
          className="h-auto w-56"
        />
      )}
      <p className="rounded-full bg-highlight px-3 py-1 text-sm font-bold">{boost.eyebrow}</p>
      <p className="font-display text-5xl font-bold tracking-tight text-accent sm:text-6xl">
        {boost.value}
      </p>
      <p className="max-w-sm text-lg font-semibold">{boost.text}</p>
      <button type="button" onClick={onContinue} className={`${buttonClass} sm:max-w-xs`}>
        Продолжить
      </button>
    </div>
  );
}
