# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

**DevTools Cloud** is a live, open-source (MIT) project at github.com/Asam237/devTools-Cloud, deployed on Vercel. It has grown past the original phased MVP plan in `do-it.md` (French, still the reference for the Firestore data model and long-term sequencing, but no longer a strict gate — see below). Currently implemented:

- **19 free client-side tools** under `/devtools/<slug>` (JSON Formatter/Diff/→TS/→Zod, JWT Decoder, UUID Generator, Regex Tester, Cron Generator, Timestamp Converter, Base64/URL/HTML Encoders, SQL Formatter, YAML/XML/CSV↔JSON, Hash Generator, Color Converter, Password Generator), each with per-tool SEO metadata, FAQ content, and an OG image (`src/lib/tool-seo.ts`, `src/app/devtools/[slug]/opengraph-image.tsx`).
- **Smart Paste**: paste any recognizable content (JWT, JSON, hex color, SQL, etc.) and it's auto-routed to the matching tool (`src/lib/detect-content.ts`).
- **Firebase Auth + Dashboard**, extended well past Phase 1: projects, collections, environments, request history, and snippets (`src/lib/firebase/{projects,collections,environments,history,snippets,snippet-comments,folders,requests,admin-snippets}.ts`, `src/components/dashboard/*`, `src/app/dashboard/**`).
- **Acquisition surfaces**: blog (`src/app/blog/**`, `src/lib/blog-posts.ts`), docs (`src/app/docs`, `src/lib/docs-content.ts`), pricing page (`src/app/pricing`, `src/lib/pricing.ts`), support page, sitemap/robots.
- **Feedback mechanism**: a signed-in-only widget (`src/components/feedback/feedback-widget.tsx`) writing to Firestore via `submitFeedback` in `src/lib/firebase/firestore.ts`.
- **Public snippets**: shareable, commentable code snippets with their own OG images (`src/app/snippets/**`, `src/components/snippets/*`, `src/lib/firebase/snippet-comments.ts`).
- **GitHub Gist import** (`src/lib/github-gist.ts`) and a UTM-tagging helper (`src/lib/utm.ts`) used across outbound/promo links.
- **Browser extension** (`extensions/browser/`): a separate esbuild-based Manifest V3 subproject (own `package.json`/`tsconfig.json`, not part of the Next.js build or ESLint run — see `eslint.config.mjs`'s `extensions/**` ignore) exposing JSON/JWT/Base64/URL/UUID/Hash tools in a popup. A VS Code extension is the planned next step (see `src/app/extension` for its landing page).

When a request maps to unbuilt Phase 4+ scope in `do-it.md` (API Platform, billing/Stripe, AI features), check with the user before building — those remain intentionally out of scope until the OSS/adoption push matures. Everything else (new tools, SEO/content, dashboard features, snippets, extensions) is fair game.

### Commands

```bash
npm run dev      # start the dev server (Turbopack, http://localhost:3000)
npm run build    # production build (also type-checks)
npm run lint     # eslint (flat config, includes react-hooks + react-compiler-strict rules)
npm run start    # serve a production build
```

There is no test suite yet. The `extensions/browser` subproject has its own commands (`npm run build`, `npm run watch`, `npm run typecheck`, `npm run package`, run from inside `extensions/browser/`) and is excluded from the root lint/build.

### Environment / Firebase setup

Firebase is optional at dev time: with no `NEXT_PUBLIC_FIREBASE_*` env vars set, `isFirebaseConfigured` (`src/lib/firebase/app.ts`) is `false`, every client-side tool works normally, and auth-dependent UI (header account menu, `/login`, `/dashboard`, the feedback widget, snippet publishing) shows a graceful "not configured" state instead of crashing. Copy `.env.local.example` to `.env.local` and fill in a Firebase Web App config to enable real auth.

`firebase.json`, `firestore.rules`, `firestore.indexes.json`, and `storage.rules` at the repo root are ready to deploy (`firebase deploy --only firestore:rules,storage`) once a Firebase project exists — they are not wired to any CI/deploy step yet. `src/lib/firebase/admin.ts` / `admin-snippets.ts` use `firebase-admin` for server-side operations — keep those imports out of client components.

### Directory layout

```
src/app/                     # routes (App Router)
  page.tsx                   # landing page (hero, search, tool grid, pricing teaser)
  layout.tsx                 # root layout: fonts, dark-mode-default script, header/footer, AuthProvider, FeedbackWidget
  opengraph-image.tsx        # OG image for the landing page
  robots.ts, sitemap.ts      # generated from SITE_URL (src/lib/site.ts) + TOOLS registry
  devtools/[slug]/
    page.tsx                 # single dynamic route rendering all tools (see TOOL_COMPONENTS map); builds per-tool metadata from TOOL_SEO
    opengraph-image.tsx      # per-tool OG image, generated from the same TOOL_SEO/TOOLS data
  blog/, docs/, pricing/, support/, extension/   # acquisition/marketing pages (already built, ahead of original phase order)
  snippets/, snippets/[id]/  # public snippet browsing + detail (own OG image)
  dashboard/, dashboard/projects/[projectId]/    # authenticated app: projects, collections, environments, history, snippets
  login/page.tsx
  api/                        # server routes (Firebase Admin-backed operations)
src/components/
  tools/                     # one client component per tool (json-formatter-tool.tsx, etc.), plus:
    tool-seo-section.tsx     # renders a tool's intro/FAQ content from TOOL_SEO below the tool itself
    tool-usage-tracker.tsx   # client-only effect that records tool usage into localStorage history
  dashboard/                 # projects/collections/environments panels, project detail, snippets manager
  snippets/                  # public snippet browser, card, comment form
  feedback/feedback-widget.tsx   # global feedback entry point (bottom-right button + modal)
  auth/, auth-provider.tsx, auth-nav.tsx   # Firebase-backed auth UI + context
  icons/                     # brand icons not covered by lucide-react (e.g. google-icon.tsx)
  ui/modal.tsx               # shared modal primitive
  site-header.tsx, command-palette.tsx, tools-explorer.tsx, faq-accordion.tsx, json-highlight.tsx,
  theme-toggle.tsx, tool-shell.tsx, tool-card.tsx, copy-button.tsx
src/lib/
  tools-registry.ts          # single source of truth for tool metadata (slug, name, icon, category) — add new tools here first
  tool-seo.ts                # TOOL_SEO: per-tool title/description/intro/FAQ/keywords, keyed by slug — drives per-tool <head> metadata, OG images, and the on-page SEO section
  detect-content.ts          # Smart Paste's content-type sniffer — ranked guesses at which tool a pasted blob belongs to
  site.ts                    # SITE_URL / SITE_NAME constants used by metadata, sitemap, robots
  pricing.ts, donate.ts, utm.ts, blog-posts.ts, docs-content.ts   # content/config for the marketing surfaces above
  history-restore.ts, use-history-data-recorder.ts, use-restorable-input.ts   # cross-tool "restore last input" plumbing backed by localStorage/dashboard history
  github-gist.ts             # Gist import used by snippet/dashboard flows
  auth/                      # AuthBackend interface + firebase-backend.ts implementation (kept swappable per spec §4)
  firebase/                  # app.ts (lazy init), firestore.ts (feedback + user profile upsert), admin.ts + per-entity modules (projects/collections/environments/history/snippets/requests/folders)
  json-diff.ts, jwt.ts, cron.ts, regex-explain.ts, json-to-typescript.ts, json-to-zod.ts, color-convert.ts, hash.ts, password.ts, csv-json.ts   # pure logic per tool, no React
  utils.ts                   # cn(), shared style class constants, localStorage tool-history helpers
extensions/browser/           # separate Manifest V3 extension subproject — own tsconfig/build (esbuild), excluded from root lint
```

To add a new tool: add an entry to `TOOLS` in `src/lib/tools-registry.ts`, create `src/components/tools/<slug>-tool.tsx`, register it in the `TOOL_COMPONENTS` map in `src/app/devtools/[slug]/page.tsx`, and add a matching entry to `TOOL_SEO` in `src/lib/tool-seo.ts` (title/description/intro/FAQ/keywords) so the route gets real metadata, an OG image, and an SEO section instead of falling back to the bare registry description. `generateStaticParams` picks up new slugs automatically; `sitemap.ts` picks them up via the `TOOLS` registry. If the tool should be Smart-Paste-detectable, add a matcher to `detectContent` in `src/lib/detect-content.ts`.

### Known constraints of this environment

The dev machine's disk (`/mnt/e`, WSL) runs close to full (single-digit GB free as of this writing) — `npm install` can fail partway and leave empty `node_modules/<pkg>/` directories that look installed but aren't (`ls` shows the dir, but it's empty). If a package import fails unexpectedly, check `du -sh node_modules/<pkg>` before assuming a code bug, and check `df -h` before large installs.

### Lint rules to know

ESLint includes the stricter React Compiler–era `react-hooks` rules (`react-hooks/set-state-in-effect`, `react-hooks/purity`), which flag most direct `setState` calls inside `useEffect` bodies and impure calls like `Date.now()`/`Math.random()` during render. Several tools legitimately need to defer non-deterministic values (current time, random UUIDs, `localStorage`/DOM reads) to client-only effects to avoid hydration mismatches — those spots use a targeted `eslint-disable-next-line` with a comment explaining why, rather than restructuring away a correct pattern. Follow that convention (justified, single-line, rule-specific disables) rather than disabling the rule file-wide or fighting it with unnecessary indirection.

## What the project is

**DevTools Cloud** ("one toolbox for every developer") is a free, open-source web toolbox for developers (JSON formatting, JWT decoding, regex testing, UUID generation, SQL formatting, encoders, etc.) — no data ever leaves the browser for the client-side tools — that funnels traffic into an account-based product (dashboard, projects, collections, snippets, and eventually API testing, webhooks, team workspaces, billing). The full original spec (in French) is in `do-it.md`; it still defines the Firestore data model and the intended long-term sequencing for anything not yet built, but the project has since expanded beyond its original MVP-only scope (see "Project status" above), with an explicit push toward open-source adoption and distribution (browser/editor extensions).

### Intended stack (per spec, §4)

- **Frontend**: Next.js, TypeScript, Tailwind CSS, dark mode by default
- **Backend**: Firebase (Authentication, Firestore, Storage, Cloud Functions, Analytics, App Check)
- **Hosting**: Vercel (frontend) + Firebase (backend services)
- Architecture should keep backend swappable — avoid hard-coupling to Firebase where reasonably possible.

### Core architectural principle: client-side first

Simple tools (JSON Formatter, JWT Decoder, Base64/URL/HTML encoders, UUID Generator, Regex Tester, Cron Generator, YAML/XML/CSV↔JSON, Timestamp Converter, SQL Formatter, Hash Generator, Color Converter, Password Generator) must run **entirely client-side in the browser**. Never send sensitive data (tokens, secrets, keys) to a server unnecessarily — this is a repeated, explicit requirement in the spec (§7, §8, §29, §31), not just a performance nicety.

Tools that inherently need a backend/Cloud Function: DNS Lookup, SSL Checker, Webhook Tester (needs a persistent endpoint), API Tester (proxying arbitrary external requests) — none of these are built yet.

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

### Conversion strategy (spec §26)

Never hard-block a free tool behind a paywall. The nudge sequence is: use tool free → prompt to sign in to save results → prompt to create a project for history → prompt to invite a team → prompt to upgrade to Pro. Keep this progressive-disclosure pattern in mind when building any paywall/upsell UI (a `pricing` page already exists for reference at `src/app/pricing`, but billing/Stripe itself is not implemented).

## Language note

The spec document is written in French; product/UI copy decisions should be checked against it when in doubt, but code, identifiers, and comments follow English convention as already established in the codebase.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
