# Contributing to DevTools Cloud

Thanks for wanting to contribute! This project stays useful because developers who use it also improve it.

## Ground rules

- Read [CLAUDE.md](CLAUDE.md) — it documents the directory layout, the project's current phase, and repo-specific conventions (lint rules, env setup, etc.).
- `do-it.md` is the source-of-truth spec (in French) for anything not yet built. Please check it before proposing a feature outside the current phase — the project intentionally builds in phases (see "Build order" in CLAUDE.md) rather than everything at once.
- Client-side tools (JSON formatting, JWT decoding, encoders, etc.) must run entirely in the browser. Never send tokens, secrets, or user data to a server unnecessarily.

## Adding a new tool

1. Add an entry to `TOOLS` in `src/lib/tools-registry.ts`.
2. Create `src/components/tools/<slug>-tool.tsx`.
3. Register it in the `TOOL_COMPONENTS` map in `src/app/devtools/[slug]/page.tsx`.
4. Add a matching entry to `TOOL_SEO` in `src/lib/tool-seo.ts` (title, description, intro, FAQ, keywords) so the route gets real metadata, an OG image, and an SEO section.

`generateStaticParams` and `sitemap.ts` pick up new slugs automatically — no other wiring needed.

## Development

```bash
npm install
npm run dev      # http://localhost:3000, Turbopack
npm run lint      # eslint (flat config, react-hooks + react-compiler-strict rules)
npm run build     # production build, also type-checks
```

There is no test suite yet. Please at least run `npm run lint` and `npm run build` before opening a PR.

Firebase is optional locally — every client-side tool works with no env vars set. See `.env.local.example` if you want to test auth/dashboard changes.

## Pull requests

- Keep PRs focused — one tool or one fix per PR is easier to review than a bundle.
- Follow the existing code style (see the lint rules in CLAUDE.md, especially around deferring non-deterministic values like `Date.now()`/`crypto.randomUUID()`/`localStorage` reads to client-only effects).
- Describe what changed and why in the PR description; screenshots are appreciated for UI changes.

## Reporting bugs / requesting features

Open a GitHub issue using the provided templates. For security vulnerabilities, see [SECURITY.md](SECURITY.md) instead — please do not open a public issue.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be respectful.
