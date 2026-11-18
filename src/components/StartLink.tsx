"use client";

import { useMutation } from "convex/react";
import type { FunctionArgs } from "convex/server";
import Link from "next/link";
import type { ReactNode } from "react";
import { api } from "../../convex/_generated/api";

type Source = NonNullable<FunctionArgs<typeof api.events.track>["source"]>;

// Кнопка «Начать тест»: ведёт в квиз и записывает, с какого блока её нажали.
export function StartLink({
  source,
  className,
  children,
}: {
  source: Source;
  className?: string;
  children: ReactNode;
}) {
  const track = useMutation(api.events.track);

  return (
    <Link
      href="/quiz"
      className={className}
      onClick={() => void track({ name: "cta_click", source })}
    >
      {children}
    </Link>
  );
}
