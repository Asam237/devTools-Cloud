import { BLOG_POSTS } from "@/lib/blog-posts";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical, tool-adjacent writing on JSON, JWTs, cron, SQL, and the everyday debugging problems developers run into.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Blog</h1>
        <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
          Practical writing on the everyday problems our tools are built to solve.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group relative flex flex-col gap-2 rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-foreground-subtle hover:shadow-lg hover:shadow-black/5"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-medium text-foreground">{post.title}</h2>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="text-sm leading-relaxed text-foreground-muted">{post.description}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-foreground-subtle">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
