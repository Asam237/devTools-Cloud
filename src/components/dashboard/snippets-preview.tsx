"use client";

import { listSnippets, type Snippet } from "@/lib/firebase/snippets";
import { ArrowUpRight, Code2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SnippetsPreview({ userId }: { userId: string }) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listSnippets(userId)
      .catch(() => [])
      .then((list) => {
        if (!cancelled) {
          setSnippets(list.slice(0, 3));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-foreground-subtle" />
          <p className="text-sm font-medium text-foreground">Snippets</p>
        </div>
        <Link href="/dashboard/snippets" className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
          View all
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-foreground-subtle" />
      ) : snippets.length === 0 ? (
        <p className="text-sm text-foreground-muted">
          Save reusable code snippets across JavaScript, SQL, Bash, and more.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {snippets.map((snippet) => (
            <Link
              key={snippet.id}
              href="/dashboard/snippets"
              className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-surface-hover"
            >
              <span className="truncate text-foreground">{snippet.title}</span>
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-foreground-subtle">
                {snippet.language}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
