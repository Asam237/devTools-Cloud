"use client";

import { withStoredUtm } from "@/lib/utm";
import { useEffect, useState } from "react";

/** Returns `href` with any stored UTM params appended, added client-side only to avoid a hydration mismatch. */
export function useTrackedHref(href: string | undefined): string | undefined {
  const [tracked, setTracked] = useState(href);

  useEffect(() => {
    if (!href) return;
    // Reading localStorage must stay client-only to avoid a hydration mismatch
    // against the server-rendered (plain) initial href.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTracked(withStoredUtm(href));
  }, [href]);

  return tracked;
}
