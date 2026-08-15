import { ContentBody } from "@/components/content-body";
import { ShareButtons } from "@/components/share-buttons";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-posts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url,
    keywords: post.tags.join(", "),
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Blog
      </Link>

      <div className="mb-8 flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-subtle">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
        <ShareButtons url={url} title={post.title} />
      </div>

      <ContentBody blocks={post.body} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
