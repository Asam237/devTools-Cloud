const UTM_STORAGE_KEY = "devtools-cloud:utm";
const UTM_PARAM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

/** Reads utm_* params from the current URL and remembers them — first-touch only, call once on load. */
export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(UTM_STORAGE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of UTM_PARAM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value;
    }
    if (Object.keys(utm).length > 0) {
      window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {
    // localStorage unavailable (private mode, quota) — attribution just won't persist
  }
}

/** The campaign that first brought this visitor in, if any — for tagging donate events/links. */
export function getStoredUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Appends the stored UTM params (if any) onto an outbound URL, e.g. a Buy Me a Coffee link. */
export function withStoredUtm(url: string): string {
  const utm = getStoredUtm();
  const keys = Object.keys(utm);
  if (keys.length === 0) return url;
  try {
    const target = new URL(url);
    for (const key of keys) {
      target.searchParams.set(key, utm[key]);
    }
    return target.toString();
  } catch {
    return url;
  }
}
