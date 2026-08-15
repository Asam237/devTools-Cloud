import type { Analytics } from "firebase/analytics";
import { getFirebaseApp, isAnalyticsConfigured } from "./app";

type AnalyticsModule = typeof import("firebase/analytics");

let modulePromise: Promise<AnalyticsModule> | null = null;
let analyticsPromise: Promise<Analytics | null> | null = null;

function getModule(): Promise<AnalyticsModule> {
  if (!modulePromise) modulePromise = import("firebase/analytics");
  return modulePromise;
}

function getAnalyticsInstance(): Promise<Analytics | null> {
  if (!isAnalyticsConfigured || typeof window === "undefined") return Promise.resolve(null);
  if (!analyticsPromise) {
    analyticsPromise = getModule().then(async ({ isSupported, getAnalytics }) => {
      const app = getFirebaseApp();
      return app && (await isSupported()) ? getAnalytics(app) : null;
    });
  }
  return analyticsPromise;
}

export type DonateEventName =
  | "donate_method_click"
  | "donate_nudge_shown"
  | "donate_nudge_dismissed"
  | "donate_nudge_accepted";

/** Best-effort: silently no-ops if analytics isn't configured/supported. */
export function logDonateEvent(name: DonateEventName, params?: Record<string, string>) {
  getAnalyticsInstance().then(async (analytics) => {
    if (!analytics) return;
    const { logEvent } = await getModule();
    logEvent(analytics, name, params);
  });
}
