"use client";

import { SnippetCard } from "@/components/snippets/snippet-card";
import { SNIPPET_LANGUAGES, type Snippet } from "@/lib/firebase/snippets";
import { inputClass } from "@/lib/utils";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export function SnippetBrowser({ snippets }: { snippets: Snippet[] }) {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<string>("All");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    snippets.forEach((snippet) => snippet.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [snippets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return snippets.filter((snippet) => {
      if (language !== "All" && snippet.language !== language) return false;
      if (tag && !snippet.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        snippet.title.toLowerCase().includes(q) ||
        snippet.description.toLowerCase().includes(q) ||
        snippet.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [snippets, search, language, tag]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search snippets..."
            className={`${inputClass} pl-9`}
          />
        </div>
        <select value={language} onChange={(event) => setLanguage(event.target.value)} className={`${inputClass} sm:w-44`}>
          <option value="All">All languages</option>
          {SNIPPET_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {allTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag((prev) => (prev === t ? null : t))}
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
          No snippets match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
}
