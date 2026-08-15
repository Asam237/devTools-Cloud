# DevTools Cloud

One toolbox for every developer — free, client-side developer tools in your browser. No data ever leaves your machine: every tool listed below runs entirely in JavaScript in the page, with nothing sent to a server.

**[devtools.cloud](https://devtools.cloud)** _(placeholder — update once the domain is live)_

## Tools

- JSON Formatter, JSON Diff, JSON → TypeScript, JSON → Zod
- JWT Decoder
- UUID Generator
- Regex Tester
- Cron Generator
- Timestamp Converter
- Base64 Encoder / Decoder
- URL Encoder / Decoder
- HTML Encoder / Decoder
- SQL Formatter
- YAML ↔ JSON Converter
- XML ↔ JSON Converter
- CSV ↔ JSON Converter
- Hash Generator
- Color Converter
- Password Generator

New tools are added regularly — see [CONTRIBUTING.md](CONTRIBUTING.md) if you'd like to add one.

## Why open source

DevTools Cloud is built in the open because the tools are more useful the more developers rely on them and shape them. Contributions — new tools, bug fixes, translations, browser and editor extensions — are welcome.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Firebase](https://firebase.google.com) (Auth, Firestore, Storage) for accounts and the dashboard — entirely optional at dev time
- Hosted on Vercel

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). All client-side tools work immediately with no configuration — Firebase is only needed for sign-in and the dashboard.

To enable auth locally, copy the env template and fill in a Firebase Web App config:

```bash
cp .env.local.example .env.local
```

See [.env.local.example](.env.local.example) for what each variable does.

### Other commands

```bash
npm run build    # production build (also type-checks)
npm run lint     # eslint
npm run start    # serve a production build
```

## Extensions

- [Browser extension](extensions/browser) — JSON, JWT, Base64, URL, UUID, and Hash tools in a toolbar popup (Chrome/Edge, Manifest V3). A code-editor extension is planned next.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add a tool, the project structure, and coding conventions. Please also read our [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Found a vulnerability? Please see [SECURITY.md](SECURITY.md) instead of opening a public issue.

## License

[MIT](LICENSE)
