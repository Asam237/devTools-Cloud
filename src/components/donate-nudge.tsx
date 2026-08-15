"use client";

import { DonateMethodCard } from "@/components/donate-method-card";
import { DONATE_METHODS } from "@/lib/donate";
import { logDonateEvent } from "@/lib/firebase/analytics";
import { DONATE_NUDGE_EVENT, acceptDonateNudge, shouldShowDonateNudge, snoozeDonateNudge } from "@/lib/utils";
import { Heart, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function DonateNudge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function check() {
      setVisible(shouldShowDonateNudge());
    }
    check();
    window.addEventListener(DONATE_NUDGE_EVENT, check);
    return () => window.removeEventListener(DONATE_NUDGE_EVENT, check);
  }, []);

  useEffect(() => {
    if (visible) logDonateEvent("donate_nudge_shown");
  }, [visible]);

  if (!visible) return null;

  function dismiss() {
    logDonateEvent("donate_nudge_dismissed");
    snoozeDonateNudge();
    setVisible(false);
  }

  function handleAction() {
    logDonateEvent("donate_nudge_accepted");
    acceptDonateNudge();
    setVisible(false);
  }

  return (
    <div className="fixed bottom-5 left-5 z-40 w-[min(21rem,calc(100vw-2.5rem))] animate-fade-in rounded-xl border border-border bg-surface p-4 shadow-xl shadow-black/10">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 shrink-0 text-accent" />
          <p className="text-sm font-medium text-foreground">Finding these tools useful?</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-foreground-subtle transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-foreground-muted">
        Everything stays free, no account needed. A small donation helps keep it running.
      </p>

      <div className="flex flex-col gap-2">
        {DONATE_METHODS.map((method) => (
          <DonateMethodCard key={method.id} method={method} compact onAction={handleAction} />
        ))}
      </div>

      <Link
        href="/pricing"
        onClick={dismiss}
        className="mt-3 block text-center text-xs font-medium text-foreground-subtle transition-colors hover:text-foreground"
      >
        See all ways to support →
      </Link>
    </div>
  );
}
