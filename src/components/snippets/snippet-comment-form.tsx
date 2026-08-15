"use client";

import { useAuth } from "@/components/auth-provider";
import { createSnippetComment } from "@/lib/firebase/snippet-comments";
import { primaryButtonClass, textareaClass } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export function SnippetCommentForm({ snippetId }: { snippetId: string }) {
  const { user, isConfigured } = useAuth();
  const [body, setBody] = useState("");
  const [posted, setPosted] = useState<{ authorName: string | null; body: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (!isConfigured || !user) {
    return (
      <p className="text-sm text-foreground-muted">
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>{" "}
        to leave a comment.
      </p>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !body.trim()) return;
    setSubmitting(true);
    const authorName = user.displayName || null;
    const text = body.trim();
    await createSnippetComment(snippetId, { authorId: user.uid, authorName, body: text });
    setPosted((prev) => [...prev, { authorName, body: text }]);
    setBody("");
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {posted.map((comment, index) => (
        <div key={index} className="rounded-lg border border-border bg-surface p-3">
          <span className="text-sm font-medium text-foreground">{comment.authorName ?? "You"}</span>
          <p className="mt-1 text-sm text-foreground-muted">{comment.body}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={3}
          placeholder="Add a comment..."
          className={textareaClass}
          required
        />
        <button type="submit" disabled={submitting || !body.trim()} className={`${primaryButtonClass} self-end`}>
          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Post comment
        </button>
      </form>
    </div>
  );
}
