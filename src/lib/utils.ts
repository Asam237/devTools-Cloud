import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const panelClass = "rounded-xl border border-border bg-surface";
export const textareaClass =
  "w-full resize-none rounded-lg border border-border bg-background-subtle px-3.5 py-3 font-mono text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10";
export const inputClass =
  "w-full rounded-lg border border-border bg-background-subtle px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10";
export const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground-subtle";
export const primaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground-muted transition-colors hover:border-foreground-subtle hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50";

export function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const HISTORY_KEY = "devtools-cloud:history";
const HISTORY_LIMIT = 20;

export type HistoryEntry = {
  slug: string;
  name: string;
  timestamp: number;
};

export function recordToolUsage(slug: string, name: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const existing: HistoryEntry[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((entry) => entry.slug !== slug);
    const next = [{ slug, name, timestamp: Date.now() }, ...filtered].slice(0, HISTORY_LIMIT);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private mode, quota) — history is best-effort only
  }
}

export function readToolHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearToolHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_KEY);
}

const SIGNUP_NUDGE_KEY = "devtools-cloud:signup-nudge";
const SIGNUP_NUDGE_THRESHOLD = 2;
const SIGNUP_NUDGE_SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;
/** Fired after `bumpSignupNudgeSignal` so a mounted banner can re-check whether to show. */
export const SIGNUP_NUDGE_EVENT = "devtools-cloud:signup-nudge-bump";

type SignupNudgeState = { count: number; snoozedUntil: number | null };

function readSignupNudgeState(): SignupNudgeState {
  if (typeof window === "undefined") return { count: 0, snoozedUntil: null };
  try {
    const raw = window.localStorage.getItem(SIGNUP_NUDGE_KEY);
    return raw ? JSON.parse(raw) : { count: 0, snoozedUntil: null };
  } catch {
    return { count: 0, snoozedUntil: null };
  }
}

function writeSignupNudgeState(state: SignupNudgeState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SIGNUP_NUDGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable — the nudge just won't persist across sessions
  }
}

/** Call whenever a signed-out visitor gets real value from a tool. */
export function bumpSignupNudgeSignal() {
  if (typeof window === "undefined") return;
  const state = readSignupNudgeState();
  writeSignupNudgeState({ ...state, count: state.count + 1 });
  window.dispatchEvent(new Event(SIGNUP_NUDGE_EVENT));
}

export function shouldShowSignupNudge(): boolean {
  const state = readSignupNudgeState();
  if (state.snoozedUntil && Date.now() < state.snoozedUntil) return false;
  return state.count >= SIGNUP_NUDGE_THRESHOLD;
}

/** User dismissed the banner without signing in — back off for a few days. */
export function snoozeSignupNudge() {
  writeSignupNudgeState({ count: 0, snoozedUntil: Date.now() + SIGNUP_NUDGE_SNOOZE_MS });
}

const DONATE_NUDGE_KEY = "devtools-cloud:donate-nudge";
const DONATE_NUDGE_THRESHOLD = 3;
const DONATE_NUDGE_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
const DONATE_NUDGE_ACCEPT_SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;
/** Fired after `bumpDonateNudgeSignal` so a mounted nudge can re-check whether to show. */
export const DONATE_NUDGE_EVENT = "devtools-cloud:donate-nudge-bump";

type DonateNudgeState = { count: number; snoozedUntil: number | null };

function readDonateNudgeState(): DonateNudgeState {
  if (typeof window === "undefined") return { count: 0, snoozedUntil: null };
  try {
    const raw = window.localStorage.getItem(DONATE_NUDGE_KEY);
    return raw ? JSON.parse(raw) : { count: 0, snoozedUntil: null };
  } catch {
    return { count: 0, snoozedUntil: null };
  }
}

function writeDonateNudgeState(state: DonateNudgeState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DONATE_NUDGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable — the nudge just won't persist across sessions
  }
}

/** Call after a "got real value from a tool" moment (page visit, successful copy). */
export function bumpDonateNudgeSignal() {
  if (typeof window === "undefined") return;
  const state = readDonateNudgeState();
  writeDonateNudgeState({ ...state, count: state.count + 1 });
  window.dispatchEvent(new Event(DONATE_NUDGE_EVENT));
}

export function shouldShowDonateNudge(): boolean {
  const state = readDonateNudgeState();
  if (state.snoozedUntil && Date.now() < state.snoozedUntil) return false;
  return state.count >= DONATE_NUDGE_THRESHOLD;
}

/** User dismissed the nudge without donating — back off for a week. */
export function snoozeDonateNudge() {
  writeDonateNudgeState({ count: 0, snoozedUntil: Date.now() + DONATE_NUDGE_SNOOZE_MS });
}

/** User took a donation action from the nudge — back off for much longer. */
export function acceptDonateNudge() {
  writeDonateNudgeState({ count: 0, snoozedUntil: Date.now() + DONATE_NUDGE_ACCEPT_SNOOZE_MS });
}
