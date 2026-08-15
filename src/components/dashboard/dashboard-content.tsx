"use client";

import { useAuth } from "@/components/auth-provider";
import { ProjectsPanel } from "@/components/dashboard/projects-panel";
import { SnippetsPreview } from "@/components/dashboard/snippets-preview";
import { listCloudHistory, type CloudHistoryEntry } from "@/lib/firebase/history";
import { stageHistoryRestore } from "@/lib/history-restore";
import { getToolBySlug } from "@/lib/tools-registry";
import { AlertCircle, Bookmark, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function DashboardContent() {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<CloudHistoryEntry[]>([]);

  useEffect(() => {
    if (!loading && isConfigured && !user) {
      router.replace("/login");
    }
  }, [loading, isConfigured, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    listCloudHistory(user.uid).then((entries) => {
      if (!cancelled) setHistory(entries);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <AlertCircle className="mx-auto mb-3 h-6 w-6 text-warning" />
        <h1 className="text-lg font-medium text-foreground">Dashboard unavailable</h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Authentication isn&apos;t configured for this deployment yet. Every free tool still works without an
          account.
        </p>
        <Link href="/#tools" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Browse tools →
        </Link>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <Loader2 className="h-5 w-5 animate-spin text-foreground-subtle" />
      </div>
    );
  }

  const firstName = (user.displayName || user.email || "there").split(" ")[0].split("@")[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Hello, {firstName}</h1>
      <p className="mt-1 text-sm text-foreground-muted">Here&apos;s what you&apos;ve been working on.</p>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-foreground-subtle">Recent tools</h2>
        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-foreground-subtle">
            You haven&apos;t used any tools yet.{" "}
            <Link href="/#tools" className="text-accent hover:underline">
              Browse the toolbox
            </Link>
            .
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((entry) => {
                const tool = getToolBySlug(entry.slug);
                const Icon = tool?.icon ?? HelpCircle;
                return (
                  <Link
                    key={entry.id}
                    href={`/devtools/${entry.slug}`}
                    onClick={() => {
                      if (entry.data) stageHistoryRestore(entry.slug, entry.data);
                    }}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-foreground-subtle"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background-subtle">
                      <Icon className="h-4 w-4 text-accent" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-medium text-foreground">{entry.name}</p>
                        {entry.data ? <Bookmark className="h-3 w-3 shrink-0 text-accent" /> : null}
                      </div>
                      <p className="text-xs text-foreground-subtle">{new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-foreground-subtle">
              <Bookmark className="mr-1 inline h-3 w-3 text-accent" />
              means you can reopen that entry with your data restored. History includes what you typed — avoid saving real secrets.
            </p>
          </>
        )}
      </section>

      <section className="mt-10">
        <ProjectsPanel userId={user.uid} />
      </section>

      <section className="mt-6">
        <SnippetsPreview userId={user.uid} />
      </section>
    </div>
  );
}
