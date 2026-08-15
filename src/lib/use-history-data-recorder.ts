"use client";

import { useAuth } from "@/components/auth-provider";
import { recordCloudHistory } from "@/lib/firebase/history";
import { getToolBySlug } from "@/lib/tools-registry";
import { useEffect, useRef } from "react";

const SAVE_DEBOUNCE_MS = 4000;
const MAX_DATA_LENGTH = 20000;

/** Debounced: saves a snapshot of `data` to the signed-in user's cloud history once it settles. */
export function useHistoryDataRecorder(slug: string, data: string) {
  const { user } = useAuth();
  const lastSaved = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const trimmed = data.trim();
    if (!trimmed || trimmed === lastSaved.current) return;
    const tool = getToolBySlug(slug);
    if (!tool) return;

    const timer = setTimeout(() => {
      lastSaved.current = trimmed;
      recordCloudHistory(user.uid, slug, tool.name, trimmed.slice(0, MAX_DATA_LENGTH));
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [user, slug, data]);
}
