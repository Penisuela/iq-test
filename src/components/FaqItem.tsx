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
    <div className="rounded-3xl bg-surface">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-4 p-5 text-left"
      >
        <span className="w-7 shrink-0 text-sm font-bold tabular-nums text-accent">
          0{index + 1}
        </span>
        <span className="flex-1 text-lg font-extrabold tracking-tight sm:text-xl">{question}</span>
        <span
          aria-hidden
          className={`grid size-10 shrink-0 place-items-center rounded-full text-2xl font-medium leading-none transition duration-300 ${
            open ? "rotate-45 bg-accent text-white" : "bg-accent-soft text-accent"
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
          <p className="max-w-2xl px-5 pb-5 pl-16 text-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}
