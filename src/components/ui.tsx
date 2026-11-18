import Link from "next/link";
import type { ReactNode } from "react";

const buttonBase =
  "inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export const buttonClass = `${buttonBase} bg-accent text-white shadow-[0_10px_24px_-10px_var(--color-accent)] hover:brightness-110`;
export const buttonGhostClass = `${buttonBase} border border-border bg-surface text-foreground hover:border-foreground`;

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-base font-bold tracking-tight">
      <span className="grid size-8 place-items-center rounded-xl bg-foreground text-sm text-highlight">
        IQ
      </span>
      Mindmark
    </Link>
  );
}

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4">
      <Logo />
      {children}
    </header>
  );
}

// Узкая колонка для экранов воронки: на телефоне во всю ширину, на десктопе по центру.
export function Screen({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 pb-10 pt-2">
      {children}
    </main>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-3xl border border-border bg-surface p-5 ${className}`}>
      {children}
    </section>
  );
}

export function Loading({ label = "Загружаем…" }: { label?: string }) {
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
        <span className="size-8 animate-spin rounded-full border-[3px] border-border border-t-foreground" />
        <p className="text-sm text-muted">{label}</p>
      </div>
    </Screen>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-border">
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
