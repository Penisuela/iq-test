"use client";

import { useMutation } from "convex/react";
import type { FunctionArgs } from "convex/server";
import { useEffect, useRef } from "react";
import { api } from "../../convex/_generated/api";
import { readStored, TOKEN_KEY } from "@/lib/storage";

type EventName = FunctionArgs<typeof api.events.track>["name"];

export function TrackEvent({ name }: { name: EventName }) {
  const track = useMutation(api.events.track);
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void track({ name, token: readStored(TOKEN_KEY) ?? undefined });
  }, [name, track]);

  return null;
}
