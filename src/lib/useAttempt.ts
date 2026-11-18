"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { TOKEN_KEY, useStored } from "@/lib/storage";

// Состояние попытки для экранов после теста. Без завершённого теста ведёт на /quiz.
export function useFinishedAttempt() {
  const router = useRouter();
  const token = useStored(TOKEN_KEY);
  const attempt = useQuery(api.attempts.paywall, token ? { token } : "skip");

  useEffect(() => {
    if (token === null || attempt?.status === "in_progress") {
      router.replace("/quiz");
    }
  }, [token, attempt?.status, router]);

  const ready = token && attempt?.status === "finished";
  return ready ? { token, attempt } : null;
}
