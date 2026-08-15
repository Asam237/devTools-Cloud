import type { Snippet } from "@/lib/firebase/snippets";
import Link from "next/link";

export function SnippetCard({ snippet }: { snippet: Snippet }) {
  return (
    <Link
      href={`/snippets/${snippet.id}`}
      className="flex flex-col rounded-xl border border-border bg-surface p-4 transition-colors hover:border-foreground-subtle"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-medium text-foreground">{snippet.title}</h3>
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-foreground-subtle">{snippet.language}</span>
      </div>
      {snippet.description ? <p className="mb-3 line-clamp-2 text-sm text-foreground-muted">{snippet.description}</p> : null}
      <pre className="mb-3 flex-1 overflow-hidden rounded-lg border border-border bg-background-subtle px-3 py-2 font-mono text-xs leading-relaxed text-foreground-muted">
        <code className="line-clamp-6">{snippet.code}</code>
      </pre>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-foreground-subtle">
        <div className="flex flex-wrap gap-1.5">
          {snippet.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-border px-2 py-0.5">
              #{tag}
            </span>
          ))}
        </div>
        {snippet.ownerName ? <span className="truncate">by {snippet.ownerName}</span> : null}
      </div>
    </Link>
  );
}
