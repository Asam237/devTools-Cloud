import { CopyButton } from "@/components/copy-button";
import { ShareButtons } from "@/components/share-buttons";
import { SnippetCommentForm } from "@/components/snippets/snippet-comment-form";
import { getSnippetByIdAdmin, listCommentsAdmin } from "@/lib/firebase/admin-snippets";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ArrowLeft, ExternalLink, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const snippet = await getSnippetByIdAdmin(id);
  if (!snippet) return {};
  const url = `/snippets/${snippet.id}`;
  const title = `${snippet.title} — ${snippet.language} snippet`;
  const description = snippet.description || `A ${snippet.language} code snippet shared on DevTools Cloud.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SnippetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snippet = await getSnippetByIdAdmin(id);
  if (!snippet) notFound();

  const comments = await listCommentsAdmin(id);
  const url = `${SITE_URL}/snippets/${snippet.id}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/snippets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Community Snippets
      </Link>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{snippet.title}</h1>
            {snippet.ownerName ? <p className="mt-1 text-sm text-foreground-subtle">by {snippet.ownerName}</p> : null}
          </div>
          <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground-subtle">
            {snippet.language}
          </span>
        </div>

        {snippet.description ? <p className="text-sm text-foreground-muted">{snippet.description}</p> : null}

        {snippet.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {snippet.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-foreground-subtle">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {snippet.sourceGistUrl ? (
          <a
            href={snippet.sourceGistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 text-xs text-foreground-subtle transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" />
            Imported from GitHub Gist
          </a>
        ) : null}

        <ShareButtons url={url} title={snippet.title} />
      </div>

      <div className="mb-2 flex items-center justify-end">
        <CopyButton value={snippet.code} />
      </div>
      <pre className="overflow-x-auto rounded-lg border border-border bg-background-subtle px-3.5 py-3 font-mono text-sm leading-relaxed text-foreground">
        <code>{snippet.code}</code>
      </pre>

      <section className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-foreground-subtle">
          <MessageSquare className="h-3.5 w-3.5" />
          Comments ({comments.length})
        </h2>
        <div className="mb-6 flex flex-col gap-3">
          {comments.length === 0 ? (
            <p className="text-sm text-foreground-subtle">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-border bg-surface p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{comment.authorName ?? "Anonymous"}</span>
                  <span className="text-xs text-foreground-subtle">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-foreground-muted">{comment.body}</p>
              </div>
            ))
          )}
        </div>
        <SnippetCommentForm snippetId={snippet.id} />
      </section>
    </div>
  );
}
