import { SnippetBrowser } from "@/components/snippets/snippet-browser";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { listPublicSnippetsAdmin } from "@/lib/firebase/admin-snippets";
import { SITE_NAME } from "@/lib/site";
import { AlertCircle, Plus, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community Snippets",
  description: "Browse public code snippets shared by developers — search by language or tag, copy, or share your own.",
  alternates: { canonical: "/snippets" },
  openGraph: {
    title: "Community Snippets",
    description: "Browse public code snippets shared by developers.",
    url: "/snippets",
    siteName: SITE_NAME,
    type: "website",
  },
};

export const revalidate = 300;

export default async function SnippetsPage() {
  if (!isFirebaseAdminConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <AlertCircle className="mx-auto mb-3 h-6 w-6 text-warning" />
        <h1 className="text-lg font-medium text-foreground">Community snippets unavailable</h1>
        <p className="mt-2 text-sm text-foreground-muted">This deployment hasn&apos;t configured Firebase Admin yet.</p>
      </div>
    );
  }

  const snippets = await listPublicSnippetsAdmin({ limit: 60 });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Community Snippets</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Public code snippets shared by developers. Search, copy, or share your own.
          </p>
        </div>
        <Link
          href="/dashboard/snippets"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          Share a snippet
        </Link>
      </div>
      {snippets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-foreground-subtle">
          <Sparkles className="mx-auto mb-3 h-5 w-5 text-accent" />
          <p className="mb-1 font-medium text-foreground">No public snippets yet</p>
          <p>Be the first to share one.</p>
        </div>
      ) : (
        <SnippetBrowser snippets={snippets} />
      )}
    </div>
  );
}
