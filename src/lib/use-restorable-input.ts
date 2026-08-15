"use client";

import { consumeHistoryRestore } from "@/lib/history-restore";
import { useEffect, useState } from "react";

/** Like `useState`, but on mount prefers a value staged from a reopened history entry, if any. */
export function useRestorableInput(slug: string, fallback: string) {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    const restored = consumeHistoryRestore(slug);
    if (restored !== null) {
      // Reading sessionStorage must stay client-only to avoid a hydration mismatch
      // against the server-rendered (always-empty) initial state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(restored);
    }
  }, [slug]);

  return [value, setValue] as const;
}

/** For tools with more than one field: JSON-decodes a staged restore value and hands it to `apply`. */
export function useRestorableJson<T>(slug: string, apply: (value: T) => void) {
  useEffect(() => {
    const restored = consumeHistoryRestore(slug);
    if (restored === null) return;
    try {
      const parsed = JSON.parse(restored) as T;
      apply(parsed);
    } catch {
      // ignore a malformed or stale restore payload
    }
  }, [slug, apply]);
}
