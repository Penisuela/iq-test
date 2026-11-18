"use client";

import { useSyncExternalStore } from "react";

export const TOKEN_KEY = "iq-attempt-token";
export const PLAN_KEY = "iq-plan";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Хранилище недоступно (приватный режим) — работаем без сохранения.
  }
  listeners.forEach((listener) => listener());
}

// undefined — значение ещё не прочитано (сервер и гидратация), null — его нет.
export function useStored(key: string): string | null | undefined {
  return useSyncExternalStore(
    subscribe,
    () => readStored(key),
    () => undefined,
  );
}
