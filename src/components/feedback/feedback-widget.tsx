"use client";

import { useAuth } from "@/components/auth-provider";
import { submitFeedback, type FeedbackCategory } from "@/lib/firebase/firestore";
import { inputClass, labelClass, primaryButtonClass, textareaClass } from "@/lib/utils";
import { Check, Loader2, MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

const CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "idea", label: "Idea" },
  { value: "other", label: "Other" },
];

export function FeedbackWidget() {
  const { user, isConfigured } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory>("bug");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    setStatus("idle");
    setMessage("");
    setCategory("bug");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !message.trim()) return;
    setStatus("submitting");
    try {
      await submitFeedback({
        userId: user.uid,
        email: user.email,
        category,
        message: message.trim(),
        page: pathname,
      });
      setStatus("submitted");
      setTimeout(close, 1500);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        title="Send feedback"
        className="fixed bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground-subtle shadow-md shadow-black/10 transition-colors hover:border-foreground-subtle hover:text-foreground"
      >
        <MessageSquare className="h-4 w-4" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-24 sm:items-center sm:pb-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-md animate-fade-in overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-medium text-foreground">Send feedback</h2>
              <button
                type="button"
                onClick={close}
                className="text-foreground-subtle transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              {!isConfigured || !user ? (
                <div className="text-center">
                  <p className="text-sm text-foreground-muted">
                    Sign in to send feedback — it takes a moment and goes straight to the team.
                  </p>
                  <Link
                    href="/login"
                    onClick={close}
                    className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
                  >
                    Sign in →
                  </Link>
                </div>
              ) : status === "submitted" ? (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <Check className="h-5 w-5 text-success" />
                  <p className="text-sm text-foreground-muted">Thanks — we got it.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className={labelClass}>Category</label>
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value as FeedbackCategory)}
                      className={inputClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={4}
                      placeholder="What's on your mind?"
                      className={textareaClass}
                      required
                    />
                  </div>
                  <button type="submit" disabled={status === "submitting" || !message.trim()} className={primaryButtonClass}>
                    {status === "submitting" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    Send feedback
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
