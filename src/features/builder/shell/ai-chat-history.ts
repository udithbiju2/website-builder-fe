import { useEffect, useState } from "react";
import type { Section } from "../../../site-kit/index.ts";
import type { AiSuggestion } from "../schema/editor-document.ts";

/** How long an accepted AI change can be rolled back. */
export const ROLLBACK_WINDOW_MS = 10 * 60 * 1000;

export type SuggestionStatus = "pending" | "accepted" | "rejected" | "rolled_back";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestion?: AiSuggestion | null;
  chatReply?: string | null;
  status?: SuggestionStatus;
  acceptedAt?: number;
  /** Canvas before/after the accepted change; only the latest accepted change keeps one. */
  rollback?: { before: Section[]; after: Section[] };
};

export type ChatSession = {
  id: string;
  title: string;
  timestamp: number;
  messages: ChatMessage[];
};

export function rollbackRemainingMs(message: ChatMessage, now: number): number {
  if (message.status !== "accepted" || !message.rollback || message.acceptedAt === undefined) return 0;
  return Math.max(0, message.acceptedAt + ROLLBACK_WINDOW_MS - now);
}

/** Drops rollback snapshots whose window has passed so localStorage stays small. */
export function pruneExpiredRollbacks(messages: ChatMessage[], now: number): ChatMessage[] {
  return messages.map((m) => (m.rollback && rollbackRemainingMs(m, now) === 0 ? { ...m, rollback: undefined } : m));
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Current time, re-rendered every second only while `active`. */
export function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  return now;
}
