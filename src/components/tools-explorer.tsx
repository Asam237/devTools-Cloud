"use client";

import { ToolCard } from "@/components/tool-card";
import { ToolRow } from "@/components/tool-row";
import { TOOL_CATEGORIES, TOOLS, getToolBySlug, type ToolCategory, type ToolDefinition } from "@/lib/tools-registry";
import { cn, readToolHistory } from "@/lib/utils";
import { History, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const POPULAR_SLUGS = ["json-formatter", "jwt-decoder", "regex-tester", "uuid-generator", "base64-encoder", "timestamp-converter"];

type CategoryFilter = "all" | ToolCategory;

function resolveTools(slugs: string[]): ToolDefinition[] {
  return slugs.map((slug) => getToolBySlug(slug)).filter((tool): tool is ToolDefinition => Boolean(tool));
}

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-surface text-foreground-muted hover:border-foreground-subtle hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function ToolsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    // Reading localStorage must stay client-only to avoid a hydration mismatch
    // against the server-rendered (always-empty) initial state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecentSlugs(readToolHistory().map((entry) => entry.slug).slice(0, 4));
  }, []);

  const isBrowsing = !query.trim() && category === "all";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (category !== "all" && tool.category !== category) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some((keyword) => keyword.includes(q))
      );
    });
  }, [query, category]);

  const popularTools = useMemo(() => resolveTools(POPULAR_SLUGS), []);
  const recentTools = useMemo(() => resolveTools(recentSlugs), [recentSlugs]);

  const remainingTools = useMemo(() => {
    if (!isBrowsing) return [];
    const featured = new Set([...POPULAR_SLUGS, ...recentSlugs]);
    return TOOLS.filter((tool) => !featured.has(tool.slug));
  }, [isBrowsing, recentSlugs]);

  return (
    <div id="tools" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 sm:px-6">
      <div className="mx-auto mb-8 max-w-xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Find your tool</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
          Search, filter by category, or just paste anything — press{" "}
          <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-foreground-subtle">
            ⌘⇧V
          </kbd>{" "}
          and we&apos;ll find the right one for you.
        </p>
      </div>

      <div className="relative mx-auto mb-5 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a developer tool..."
          className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm text-foreground shadow-sm placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
        />
      </div>

      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        <CategoryPill active={category === "all"} onClick={() => setCategory("all")}>
          All <span className="opacity-60">{TOOLS.length}</span>
        </CategoryPill>
        {TOOL_CATEGORIES.map((cat) => (
          <CategoryPill key={cat} active={category === cat} onClick={() => setCategory(cat)}>
            {cat} <span className="opacity-60">{TOOLS.filter((tool) => tool.category === cat).length}</span>
          </CategoryPill>
        ))}
      </div>

      {!isBrowsing ? (
        filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-foreground-muted">
            No tools match &ldquo;{query}&rdquo;. Try another search or category.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col gap-12 pb-24">
          {recentTools.length > 0 ? (
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-foreground-subtle">
                <History className="h-3.5 w-3.5" />
                Jump back in
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recentTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-foreground-subtle">
              <Sparkles className="h-3.5 w-3.5" />
              Popular
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>

          {remainingTools.length > 0 ? (
            <section>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-foreground-subtle">Everything else</h3>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {remainingTools.map((tool) => (
                  <ToolRow key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
