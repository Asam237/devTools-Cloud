import { BLOG_POSTS } from "@/lib/blog-posts";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { listPublicSnippetsAdmin } from "@/lib/firebase/admin-snippets";
import { SITE_URL } from "@/lib/site";
import { TOOLS } from "@/lib/tools-registry";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/docs`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/snippets`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/extension`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${SITE_URL}/devtools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const snippetRoutes: MetadataRoute.Sitemap = isFirebaseAdminConfigured
    ? (await listPublicSnippetsAdmin({ limit: 1000 })).map((snippet) => ({
        url: `${SITE_URL}/snippets/${snippet.id}`,
        lastModified: new Date(snippet.updatedAt),
        changeFrequency: "monthly",
        priority: 0.4,
      }))
    : [];

  return [...staticRoutes, ...toolRoutes, ...blogRoutes, ...snippetRoutes];
}
