"use client";

import type { Snippet } from "@/lib/firebase/snippets";
import { inputClass } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function PublicSnippetsBrowser({ snippets }: { snippets: Snippet[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | "All">("All");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    snippets.forEach((snippet) => snippet.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [snippets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return snippets.filter((snippet) => {
      if (tag !== "All" && !snippet.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        snippet.title.toLowerCase().includes(q) ||
        snippet.description.toLowerCase().includes(q) ||
        snippet.tags.some((t) => t.includes(q))
      );
    });
  }, [snippets, query, tag]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search public snippets..."
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      {allTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTag("All")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              tag === "All" ? "border-accent bg-accent-soft text-accent" : "border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            All tags
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                tag === t ? "border-accent bg-accent-soft text-accent" : "border-border text-foreground-muted hover:text-foreground"
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-foreground-subtle">
          No public snippets match yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/snippets/${snippet.id}`}
              className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-foreground-subtle"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-medium text-foreground">{snippet.title}</h3>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-foreground-subtle">
                  {snippet.language}
                </span>
              </div>
              {snippet.description ? <p className="line-clamp-2 text-xs text-foreground-muted">{snippet.description}</p> : null}
              <pre className="mt-1 max-h-24 overflow-hidden rounded-lg border border-border bg-background-subtle px-3 py-2 font-mono text-xs text-foreground-muted">
                <code>{snippet.code.slice(0, 300)}</code>
              </pre>
              <div className="mt-1 flex items-center justify-between gap-2 text-xs text-foreground-subtle">
                <span className="truncate">{snippet.ownerName ?? "Anonymous"}</span>
                {snippet.tags.length > 0 ? <span className="shrink-0">#{snippet.tags[0]}</span> : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
