"use client";

import { useAuth } from "@/components/auth-provider";
import { SIGNUP_NUDGE_EVENT, shouldShowSignupNudge, snoozeSignupNudge } from "@/lib/utils";
import { History, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SignupBanner() {
  const { user, isConfigured } = useAuth();
  const [signalled, setSignalled] = useState(false);

  useEffect(() => {
    function check() {
      setSignalled(shouldShowSignupNudge());
    }
    check();
    window.addEventListener(SIGNUP_NUDGE_EVENT, check);
    return () => window.removeEventListener(SIGNUP_NUDGE_EVENT, check);
  }, []);

  if (!isConfigured || user || !signalled) return null;

  function dismiss() {
    snoozeSignupNudge();
    setSignalled(false);
  }

  return (
    <div className="flex items-center justify-center gap-3 border-b border-border bg-accent-soft px-4 py-2 text-xs text-foreground sm:text-sm">
      <History className="h-4 w-4 shrink-0 text-accent" />
      <p className="min-w-0 flex-1 truncate text-center sm:flex-initial">
        Sign in to save your tool history across devices — it&apos;s free.
      </p>
      <Link href="/login" onClick={dismiss} className="shrink-0 font-medium text-accent hover:underline">
        Sign in
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-foreground-subtle transition-colors hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
