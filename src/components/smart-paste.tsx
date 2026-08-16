"use client";

import { buildRestorePayload, detectContent } from "@/lib/detect-content";
import { stageHistoryRestore } from "@/lib/history-restore";
import { getToolBySlug } from "@/lib/tools-registry";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function isEditableElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return (el as HTMLElement).isContentEditable;
}

export function SmartPaste() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const router = useRouter();

  const matches = useMemo(() => detectContent(text), [text]);

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      if (isEditableElement(document.activeElement)) return;
      const pasted = event.clipboardData?.getData("text");
      if (!pasted || !pasted.trim()) return;
      event.preventDefault();
      setText(pasted);
      setOpen(true);
    }
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "v") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("paste", onPaste);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    setText("");
  }

  function openTool(slug: string) {
    stageHistoryRestore(slug, buildRestorePayload(slug, text));
    setOpen(false);
    setText("");
    router.push(`/devtools/${slug}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Paste & detect"
        title="Paste anything — we'll find the right tool (⌘⇧V)"
        className="fixed bottom-5 right-20 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground-subtle shadow-md shadow-black/10 transition-colors hover:border-foreground-subtle hover:text-foreground"
      >
        <Sparkles className="h-4 w-4" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-lg animate-fade-in overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-medium text-foreground">Paste anything</h2>
              </div>
              <button type="button" onClick={close} className="text-foreground-subtle transition-colors hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4">
              <textarea
                autoFocus
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Paste JSON, a JWT, SQL, XML, CSV, a color, a URL-encoded string... anything."
                rows={5}
                className="w-full resize-none rounded-lg border border-border bg-background-subtle px-3.5 py-3 font-mono text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
              />

              <div className="mt-3 flex flex-col gap-1.5">
                {text.trim() && matches.length === 0 ? (
                  <p className="px-1 py-2 text-xs text-foreground-subtle">
                    Couldn&apos;t identify this one — press ⌘K to browse every tool.
                  </p>
                ) : null}
                {matches.map((match) => {
                  const tool = getToolBySlug(match.slug);
                  if (!tool) return null;
                  const Icon = tool.icon;
                  return (
                    <button
                      key={match.slug}
                      type="button"
                      onClick={() => openTool(match.slug)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-hover"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background-subtle">
                        <Icon className="h-4 w-4 text-accent" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{tool.name}</span>
                        <span className="block truncate text-xs text-foreground-muted">{match.reason}</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" />
                    </button>
                  );
                })}
              </div>

              {!text.trim() ? (
                <p className="mt-3 px-1 text-xs text-foreground-subtle">
                  Tip: paste anywhere on the site (not just here) — we&apos;ll pop this up automatically.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
