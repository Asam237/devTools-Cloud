# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Phase 1 (MVP) is implemented: landing page, all 12 free client-side tools, Firebase Auth, and a Dashboard. Phase 2 (Acquisition) has started but is not complete: each tool page already has per-tool SEO metadata, FAQ content, an OG image, plus a sitemap and robots.txt (see `src/lib/tool-seo.ts`, `src/app/devtools/[slug]/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`) — but there's no blog, docs, or feedback mechanism yet. Phase 3+ (Projects/Collections/history, API Platform, billing, AI) has not been started. `do-it.md` (French) remains the source of truth for scope, data model, and sequencing for anything not yet built — read the relevant section before adding a feature, and respect the phase order in §36–37 (don't jump ahead to Phase 4+ features).

Not yet a git repository — there is no commit history to consult.

### Commands

```bash
npm run dev      # start the dev server (Turbopack, http://localhost:3000)
npm run build    # production build (also type-checks)
npm run lint     # eslint (flat config, includes react-hooks + react-compiler-strict rules)
npm run start    # serve a production build
```

There is no test suite yet.

### Environment / Firebase setup

Firebase is optional at dev time: with no `NEXT_PUBLIC_FIREBASE_*` env vars set, `isFirebaseConfigured` (`src/lib/firebase/app.ts`) is `false`, every client-side tool works normally, and auth-dependent UI (header account menu, `/login`, `/dashboard`) shows a graceful "not configured" state instead of crashing. Copy `.env.local.example` to `.env.local` and fill in a Firebase Web App config to enable real auth.

`firebase.json`, `firestore.rules`, `firestore.indexes.json`, and `storage.rules` at the repo root are ready to deploy (`firebase deploy --only firestore:rules,storage`) once a Firebase project exists — they are not wired to any CI/deploy step yet.

### Directory layout

```
src/app/                     # routes (App Router)
  page.tsx                   # landing page (hero, search, tool grid, pricing teaser)
  layout.tsx                 # root layout: fonts, dark-mode-default script, header/footer, AuthProvider
  opengraph-image.tsx        # OG image for the landing page
  robots.ts, sitemap.ts      # generated from SITE_URL (src/lib/site.ts) + TOOLS registry
  devtools/[slug]/
    page.tsx                 # single dynamic route rendering all 12 tools (see TOOL_COMPONENTS map); builds per-tool metadata from TOOL_SEO
    opengraph-image.tsx      # per-tool OG image, generated from the same TOOL_SEO/TOOLS data
  login/page.tsx
  dashboard/page.tsx
src/components/
  tools/                     # one client component per tool (json-formatter-tool.tsx, etc.), plus:
    tool-seo-section.tsx     # renders a tool's intro/FAQ content from TOOL_SEO below the tool itself
    tool-usage-tracker.tsx   # client-only effect that records tool usage into localStorage history
  auth/, auth-provider.tsx, auth-nav.tsx   # Firebase-backed auth UI + context
  dashboard/                 # dashboard content
  icons/                     # brand icons not covered by lucide-react (e.g. google-icon.tsx)
  site-header.tsx, command-palette.tsx, tools-explorer.tsx, faq-accordion.tsx, json-highlight.tsx,
  theme-toggle.tsx, tool-shell.tsx, tool-card.tsx, copy-button.tsx
src/lib/
  tools-registry.ts          # single source of truth for tool metadata (slug, name, icon, category) — add new tools here first
  tool-seo.ts                # TOOL_SEO: per-tool title/description/intro/FAQ/keywords, keyed by slug — drives per-tool <head> metadata, OG images, and the on-page SEO section
  site.ts                    # SITE_URL / SITE_NAME constants used by metadata, sitemap, robots
  auth/                      # AuthBackend interface + firebase-backend.ts implementation (kept swappable per spec §4)
  firebase/                  # app.ts (lazy init), firestore.ts (user profile upsert)
  json-diff.ts, jwt.ts, cron.ts, regex-explain.ts, json-to-typescript.ts, json-to-zod.ts   # pure logic per tool, no React
  utils.ts                   # cn(), shared style class constants, localStorage tool-history helpers
```

To add a new tool: add an entry to `TOOLS` in `src/lib/tools-registry.ts`, create `src/components/tools/<slug>-tool.tsx`, register it in the `TOOL_COMPONENTS` map in `src/app/devtools/[slug]/page.tsx`, and add a matching entry to `TOOL_SEO` in `src/lib/tool-seo.ts` (title/description/intro/FAQ/keywords) so the route gets real metadata, an OG image, and an SEO section instead of falling back to the bare registry description. `generateStaticParams` picks up new slugs automatically; `sitemap.ts` picks them up via the `TOOLS` registry.

### Known constraints of this environment

The dev machine's disk (`/mnt/e`, WSL) runs close to full (single-digit GB free as of this writing) — `npm install` can fail partway and leave empty `node_modules/<pkg>/` directories that look installed but aren't (`ls` shows the dir, but it's empty). If a package import fails unexpectedly, check `du -sh node_modules/<pkg>` before assuming a code bug, and check `df -h` before large installs.

### Lint rules to know

ESLint includes the stricter React Compiler–era `react-hooks` rules (`react-hooks/set-state-in-effect`, `react-hooks/purity`), which flag most direct `setState` calls inside `useEffect` bodies and impure calls like `Date.now()`/`Math.random()` during render. Several tools legitimately need to defer non-deterministic values (current time, random UUIDs, `localStorage`/DOM reads) to client-only effects to avoid hydration mismatches — those spots use a targeted `eslint-disable-next-line` with a comment explaining why, rather than restructuring away a correct pattern. Follow that convention (justified, single-line, rule-specific disables) rather than disabling the rule file-wide or fighting it with unnecessary indirection.

## What the project is

**DevTools Cloud** ("one toolbox for every developer") is a planned SaaS: a free web toolbox for developers (JSON formatting, JWT decoding, regex testing, UUID generation, SQL formatting, encoders, etc.) that funnels traffic into a freemium product (accounts, projects, collections, API testing, webhooks, team workspaces, billing). The full spec (in French) is in `do-it.md`; read it before starting significant work — it defines scope, data model, and sequencing in detail. Key points condensed below.

### Intended stack (per spec, §4)

- **Frontend**: Next.js, TypeScript, Tailwind CSS, dark mode by default
- **Backend**: Firebase (Authentication, Firestore, Storage, Cloud Functions, Analytics, App Check)
- **Hosting**: Vercel (frontend) + Firebase (backend services)
- Architecture should keep backend swappable — avoid hard-coupling to Firebase where reasonably possible.

### Core architectural principle: client-side first

Simple tools (JSON Formatter, JWT Decoder, Base64/URL/HTML encoders, UUID Generator, Regex Tester, Cron Generator, YAML/XML↔JSON, Timestamp Converter, SQL Formatter) must run **entirely client-side in the browser**. Never send sensitive data (tokens, secrets, keys) to a server unnecessarily — this is a repeated, explicit requirement in the spec (§7, §8, §29, §31), not just a performance nicety.

Tools that inherently need a backend/Cloud Function: DNS Lookup, SSL Checker, Webhook Tester (needs a persistent endpoint), API Tester (proxying arbitrary external requests).

### Firestore data model (spec §28)

```
users/{userId}
users/{userId}/projects/{projectId}
users/{userId}/projects/{projectId}/collections/{collectionId}
users/{userId}/projects/{projectId}/requests/{requestId}
users/{userId}/projects/{projectId}/environments/{environmentId}
users/{userId}/snippets/{snippetId}
users/{userId}/history/{historyId}
workspaces/{workspaceId}
workspaces/{workspaceId}/members/{userId}
workspaces/{workspaceId}/projects/{projectId}
workspaces/{workspaceId}/collections/{collectionId}
subscriptions/{userId}
```

Firestore Security Rules must strictly scope reads/writes to the owning user (or workspace member), and environment/secret values must never be exposed in plaintext logs or the UI.

### Build order (spec §36–37 — do not skip ahead)

The spec is explicit that the MVP must stay small: 10–15 free client-side tools + auth + dashboard, nothing more, until traffic exists. Respect this phased order when asked to add features:

1. **Phase 1 (MVP)**: Landing page, Firebase Auth, Dashboard, JSON Formatter/Diff/→TS/→Zod, JWT Decoder, UUID Generator, Regex Tester, Cron Generator, Timestamp Converter, Base64, URL Encoder, SQL Formatter
2. **Phase 2 (Acquisition)**: SEO, per-tool landing pages (`/devtools/<tool-slug>`), blog, docs, feedback
3. **Phase 3 (SaaS)**: Projects, collections, history, snippets, environments, cloud save
4. **Phase 4 (API Platform)**: API Tester, Webhook Tester + replay, API Collections, API docs
5. **Phase 5 (Monetization)**: Free/Pro/Team/Business tiers, Stripe, quotas, billing
6. **Phase 6 (AI)**: AI assistants layered onto existing tools (JSON/SQL/Regex explain-generate-optimize, API doc/test generation) — quota-gated, never the product's core

Each free tool needs its own SEO-friendly route (e.g. `/devtools/json-formatter`) with title, description, FAQ, and explanatory content (spec §25, §30).

### Conversion strategy (spec §26)

Never hard-block a free tool behind a paywall. The nudge sequence is: use tool free → prompt to sign in to save results → prompt to create a project for history → prompt to invite a team → prompt to upgrade to Pro. Keep this progressive-disclosure pattern in mind when building any paywall/upsell UI.

## Language note

The spec document is written in French; product/UI copy decisions should be checked against it when in doubt, but code, identifiers, and comments should follow whatever convention is established once implementation starts (do not assume French naming in code).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
