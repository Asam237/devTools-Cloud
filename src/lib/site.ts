// Prefer an explicitly configured URL; fall back to the stable Vercel production domain (auto-injected,
// no manual config needed) before finally falling back to localhost for local dev.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
export const SITE_NAME = "DevTools Cloud";
