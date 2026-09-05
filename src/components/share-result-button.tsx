"use client";

import { useAuth } from "@/components/auth-provider";
import { Modal } from "@/components/ui/modal";
import { createSnippet, type SnippetLanguage } from "@/lib/firebase/snippets";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Check, Copy, Loader2, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ShareResultButton({
  value,
  toolName,
  toolSlug,
  language = "Other",
  className,
}: {
  value: string;
  toolName: string;
  toolSlug: string;
  language?: SnippetLanguage;
  className?: string;
}) {
  const { user, isConfigured } = useAuth();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sharing" | "done" | "error">("idle");
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleOpen() {
    setOpen(true);
    if (!isConfigured || !user || !value) return;
    setStatus("sharing");
    try {
      const id = await createSnippet(user.uid, user.displayName, {
        title: `${toolName} result`,
        description: `Shared from the ${toolName} on DevTools Cloud.`,
        language,
        code: value,
        tags: ["shared-result", toolSlug],
        visibility: "unlisted",
        folderId: null,
      });
      setUrl(`${SITE_URL}/snippets/${id}`);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function close() {
    setOpen(false);
    setStatus("idle");
    setUrl(null);
    setCopied(false);
  }

  async function copyLink() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={!value}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:border-foreground-subtle hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>

      <Modal open={open} onClose={close} title="Share this result">
        {!isConfigured || !user ? (
          <div className="text-center">
            <p className="text-sm text-foreground-muted">
              Sign in to turn this result into a shareable link — nothing is shared until you do.
            </p>
            <Link
              href="/login"
              onClick={close}
              className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              Sign in →
            </Link>
          </div>
        ) : status === "sharing" ? (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-foreground-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating link…
          </div>
        ) : status === "error" ? (
          <p className="text-sm text-danger">Something went wrong creating the link — try again.</p>
        ) : url ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-foreground-muted">
              Anyone with this link can view the result. It won&apos;t be listed publicly — manage or delete it
              anytime from your{" "}
              <Link href="/dashboard/snippets" onClick={close} className="text-accent hover:underline">
                dashboard
              </Link>
              .
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={url}
                onFocus={(event) => event.currentTarget.select()}
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:border-foreground-subtle hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
