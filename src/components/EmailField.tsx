"use client";

import { useId, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Текст ошибки для адреса или null, если адрес в порядке. Правило то же, что на сервере.
export function emailError(value: string): string | null {
  const email = value.trim();
  if (email === "") return "Введите email";
  if (!email.includes("@")) return "В адресе не хватает символа @";
  if (!EMAIL_PATTERN.test(email)) return "Проверьте адрес: он должен быть вида name@example.com";
  return null;
}

// Поле email с собственной подсказкой об ошибке под полем вместо браузерного пузыря.
// Ошибка появляется после ухода из поля или попытки отправки (showError) и исчезает, как только адрес исправлен.
export function EmailField({
  value,
  onChange,
  showError,
  hint,
  tone = "surface",
}: {
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
  hint?: string;
  tone?: "surface" | "background";
}) {
  const id = useId();
  const [touched, setTouched] = useState(false);
  const error = showError || touched ? emailError(value) : null;

  return (
    <div className="flex flex-col gap-2 text-sm">
      <label htmlFor={id} className="font-semibold">
        Email
      </label>
      <input
        id={id}
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(value.trim() !== "")}
        aria-invalid={error !== null}
        aria-describedby={`${id}-note`}
        className={`h-14 w-full rounded-2xl border-2 px-4 text-base font-medium outline-none transition placeholder:font-normal placeholder:text-muted/70 ${
          tone === "surface" ? "bg-surface" : "bg-background"
        } ${error ? "border-danger" : "border-transparent focus:border-accent"}`}
      />
      <p
        id={`${id}-note`}
        role={error ? "alert" : undefined}
        className={error ? "font-medium text-danger" : "text-muted"}
      >
        {error ?? hint}
      </p>
    </div>
  );
}
