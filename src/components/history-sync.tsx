"use client";

import { useAuth } from "@/components/auth-provider";
import { recordCloudHistory } from "@/lib/firebase/history";
import { readToolHistory } from "@/lib/utils";
import { useEffect, useRef } from "react";

const MIGRATION_KEY = "devtools-cloud:history-migrated-for";

/** One-time migration: on first sign-in, copy locally-tracked tool history into the user's cloud history. */
export function HistorySync() {
  const { user } = useAuth();
  const migrating = useRef(false);

  useEffect(() => {
    if (!user || migrating.current) return;
    if (window.localStorage.getItem(MIGRATION_KEY) === user.uid) return;

    migrating.current = true;
    const entries = [...readToolHistory()].reverse();

    (async () => {
      for (const entry of entries) {
        await recordCloudHistory(user.uid, entry.slug, entry.name);
      }
      window.localStorage.setItem(MIGRATION_KEY, user.uid);
    })();
  }, [user]);

  return null;
}
