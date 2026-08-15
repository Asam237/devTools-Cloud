# DevTools Cloud — Browser Extension

A Manifest V3 popup extension exposing a subset of [DevTools Cloud](https://devtools.cloud)'s tools directly from the browser toolbar: JSON Formatter, JWT Decoder, Base64, URL Encoder, UUID Generator, Hash Generator (MD5/SHA-1/SHA-256/SHA-384/SHA-512).

Everything runs client-side, same as the web app — no network requests, no permissions beyond showing a popup.

## Why this exists

Shares logic with the main app instead of duplicating it: `src/popup.ts` imports `decodeJwt`/`getTimeClaims` from `../../src/lib/jwt.ts` and `computeAllHashes` from `../../src/lib/hash.ts` directly — those stay the single source of truth. The `uuid` package resolves from the repo root's `node_modules` the same way (Node's module resolution walks up parent directories), so no extra install was needed for it either.

## Develop

```bash
npm install
npm run watch     # rebuilds dist/ on change
```

Then in Chrome/Edge: `chrome://extensions` → enable Developer mode → "Load unpacked" → select this folder's `dist/`.

## Build / package for the store

```bash
npm run build      # one-off build into dist/
npm run package     # build + zip dist/ into devtools-cloud-extension.zip
```

## Adding a tool

1. Add markup to `src/popup.html` (a new `<button class="tab">` + `<section class="panel" data-panel="...">`).
2. Add the pure logic to `src/tools/<tool>.ts`, or import it from the main app's `src/lib/` if it already exists there.
3. Wire it up in `src/popup.ts` (follow the pattern of `initJson`/`initBase64`/etc.).

Keep tools dependency-free where possible — this popup intentionally has no UI framework, to stay fast and small.
