import Link from "next/link";
import type { ReactNode } from "react";

const buttonBase =
  "inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export const buttonClass = `${buttonBase} bg-accent text-white shadow-[0_10px_24px_-10px_var(--color-accent)] hover:brightness-110`;
export const buttonGhostClass = `${buttonBase} bg-accent-soft text-accent hover:brightness-95`;

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-display text-base font-bold tracking-tight">
      <span className="grid size-8 place-items-center rounded-xl bg-accent text-sm text-white">M</span>
      Mindmark
    </Link>
  );
}

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4">
        <Logo />
        {children}
      </div>
    </header>
  );
}

// Узкая колонка для экранов воронки: на телефоне во всю ширину, на десктопе по центру.
export function Screen({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <main
      className={`mx-auto flex w-full flex-1 flex-col gap-5 px-4 pb-10 pt-2 ${
        wide ? "max-w-md md:max-w-3xl md:gap-8 md:pt-6" : "max-w-md"
      }`}
    >
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
    <section className={`rounded-3xl bg-surface p-5 ${className}`}>{children}</section>
  );
}

// Лавандовая панель — общий контейнер блоков на всех экранах; внутри лежат белые карточки.
export function Tint({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex flex-col gap-4 rounded-[2rem] bg-accent-soft p-4 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function Loading({ label = "Загружаем…" }: { label?: string }) {
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
        <span className="size-8 animate-spin rounded-full border-[3px] border-accent-soft border-t-accent" />
        <p className="text-sm text-muted">{label}</p>
      </div>
    </Screen>
  );
}

// smooth={false} — когда значение и так обновляется каждый кадр и CSS-переход только мешает.
export function ProgressBar({ value, smooth = true }: { value: number; smooth?: boolean }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-accent/15">
      <div
        className={`h-full rounded-full bg-accent ${
          smooth ? "transition-[width] duration-500 ease-out" : ""
        }`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
