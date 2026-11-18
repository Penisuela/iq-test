"use client";

import { useId, useState } from "react";

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="rounded-2xl border border-border bg-surface">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-bold"
      >
        {question}
        <span
          aria-hidden
          className={`text-2xl font-medium leading-none text-muted transition-transform duration-300 ${
            open ? "rotate-45" : ""
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
          <p className="px-5 pb-4 text-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}
