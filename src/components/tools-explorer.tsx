"use client";

import { ToolCard } from "@/components/tool-card";
import { TOOL_CATEGORIES, TOOLS } from "@/lib/tools-registry";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export function ToolsExplorer() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some((keyword) => keyword.includes(q))
    );
  }, [query]);

  const groups = useMemo(() => {
    return TOOL_CATEGORIES.map((category) => ({
      category,
      tools: filtered.filter((tool) => tool.category === category),
    })).filter((group) => group.tools.length > 0);
  }, [filtered]);

  return (
    <div id="tools" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 sm:px-6">
      <div className="relative mx-auto mb-10 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a developer tool..."
          className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm text-foreground shadow-sm placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
        />
      </div>

      {groups.length === 0 ? (
        <p className="py-16 text-center text-sm text-foreground-muted">
          No tools match &ldquo;{query}&rdquo;. Try another search.
        </p>
      ) : (
        <div className="flex flex-col gap-10 pb-24">
          {groups.map((group) => (
            <section key={group.category}>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-foreground-subtle">
                {group.category}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
