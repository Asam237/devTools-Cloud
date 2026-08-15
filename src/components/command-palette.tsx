"use client";

import { TOOLS } from "@/lib/tools-registry";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some((keyword) => keyword.includes(q))
    );
  }, [query]);

  function openPalette() {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => {
          if (!prev) openPalette();
          return !prev;
        });
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function navigateTo(index: number) {
    const tool = results[index];
    if (!tool) return;
    setOpen(false);
    router.push(`/devtools/${tool.slug}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="flex w-full items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground-subtle transition-colors hover:border-foreground-subtle sm:w-64"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 text-left">Search tools...</span>
        <kbd className="hidden rounded border border-border bg-background-subtle px-1.5 py-0.5 font-mono text-[10px] text-foreground-subtle sm:inline">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg animate-fade-in overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-foreground-subtle" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex((prev) => Math.max(prev - 1, 0));
                  } else if (event.key === "Enter") {
                    event.preventDefault();
                    navigateTo(activeIndex);
                  }
                }}
                placeholder="Search a developer tool..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground-subtle">
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-foreground-subtle">No tools found.</p>
              ) : (
                results.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.slug}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => navigateTo(index)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        index === activeIndex ? "bg-accent-soft" : "hover:bg-surface-hover"
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background-subtle">
                        <Icon className="h-4 w-4 text-accent" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{tool.name}</span>
                        <span className="block truncate text-xs text-foreground-muted">
                          {tool.shortDescription}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
