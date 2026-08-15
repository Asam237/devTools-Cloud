"use client";

import { useAuth } from "@/components/auth-provider";
import { recordCloudHistory } from "@/lib/firebase/history";
import { bumpDonateNudgeSignal, bumpSignupNudgeSignal, recordToolUsage } from "@/lib/utils";
import { useEffect } from "react";

export function ToolUsageTracker({ slug, name }: { slug: string; name: string }) {
  const { user } = useAuth();

  useEffect(() => {
    recordToolUsage(slug, name);
    bumpDonateNudgeSignal();
  }, [slug, name]);

  useEffect(() => {
    if (user) {
      recordCloudHistory(user.uid, slug, name);
    } else {
      bumpSignupNudgeSignal();
    }
  }, [user, slug, name]);

  return null;
}
