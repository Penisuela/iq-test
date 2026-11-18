import type { ReactNode } from "react";

export const buttonClass =
  "inline-flex h-14 w-full items-center justify-center rounded-2xl bg-accent px-6 text-base font-semibold text-white transition active:scale-[0.99] disabled:opacity-50";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8">
      {children}
    </main>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5">
      {children}
    </section>
  );
}
