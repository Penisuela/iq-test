"use client";

import { useId, useState } from "react";

export function FaqItem({
  index,
  question,
  answer,
}: {
  index: number;
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-t-2 border-foreground last:border-b-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="group flex w-full cursor-pointer items-center gap-4 py-5 text-left sm:gap-8 sm:py-7"
      >
        <span className="w-8 shrink-0 text-sm font-bold tabular-nums text-muted sm:w-12 sm:text-base">
          0{index + 1}
        </span>
        <span className="flex-1 text-xl font-extrabold tracking-tight sm:text-3xl">
          {question}
        </span>
        <span
          aria-hidden
          className={`grid size-10 shrink-0 place-items-center rounded-full text-2xl font-medium leading-none transition duration-300 sm:size-12 ${
            open
              ? "rotate-45 bg-foreground text-highlight"
              : "bg-surface group-hover:bg-highlight"
          }`}
        >
          +
        </span>
      </button>
      {/* Высота анимируется через grid: 0fr → 1fr работает без измерения контента. */}
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 pl-12 text-lg text-muted sm:pb-8 sm:pl-20">{answer}</p>
        </div>
      </div>
    </div>
  );
}
