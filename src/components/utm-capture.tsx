"use client";

import { captureUtm } from "@/lib/utm";
import { useEffect } from "react";

/** Mounted once globally — stages any utm_* params from the landing URL for later donate-event tagging. */
export function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);

  return null;
}
