"use client";

import { useAuth } from "@/components/auth-provider";
import { authBackend } from "@/lib/auth";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthNav() {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isConfigured || loading) {
    return <div className="h-8 w-16" aria-hidden />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground-muted transition-colors hover:border-foreground-subtle hover:text-foreground"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-accent-soft text-accent"
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </button>

      {menuOpen ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
            <div className="border-b border-border px-3 py-2">
              <p className="truncate text-sm font-medium text-foreground">{user.displayName || "Account"}</p>
              <p className="truncate text-xs text-foreground-subtle">{user.email}</p>
            </div>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <button
              type="button"
              onClick={async () => {
                setMenuOpen(false);
                await authBackend.signOut();
                router.push("/");
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
