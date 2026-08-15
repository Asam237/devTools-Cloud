const RESTORE_PREFIX = "devtools-cloud:restore:";

/** Hands a saved history value off to the next load of a given tool page. */
export function stageHistoryRestore(slug: string, data: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(RESTORE_PREFIX + slug, data);
  } catch {
    // sessionStorage unavailable (private mode, quota) — restore just won't prefill
  }
}

/** Reads and clears any value staged for this tool — consumed once per navigation. */
export function consumeHistoryRestore(slug: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const key = RESTORE_PREFIX + slug;
    const value = window.sessionStorage.getItem(key);
    if (value !== null) window.sessionStorage.removeItem(key);
    return value;
  } catch {
    return null;
  }
}
