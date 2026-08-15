export type ToolFaq = { question: string; answer: string };

export type ToolSeo = {
  title: string;
  description: string;
  intro: string[];
  faq: ToolFaq[];
  keywords: string[];
};

export const TOOL_SEO: Record<string, ToolSeo> = {
  "json-formatter": {
    title: "JSON Formatter & Validator — Free Online Tool",
    description:
      "Format, validate, and minify JSON online for free. Instant syntax highlighting, error detection, and search — all processed locally in your browser.",
    intro: [
      "JSON Formatter turns messy, minified, or hand-written JSON into clean, indented, easy-to-read output — with syntax highlighting so keys, strings, numbers, and booleans are visually distinct at a glance.",
      "It also doubles as a validator: if your JSON has a syntax error, you'll see exactly what's wrong instead of a cryptic parser message. Everything runs client-side, so nothing you paste is ever sent to a server.",
    ],
    faq: [
      {
        question: "Is my JSON data sent to a server?",
        answer:
          "No. Formatting, validation, and minification all happen locally in your browser using the native JSON parser — your data never leaves your device.",
      },
      {
        question: "Can I minify JSON as well as format it?",
        answer: "Yes — use the Minify button to collapse formatted JSON back into a single compact line.",
      },
      {
        question: "What happens if my JSON is invalid?",
        answer:
          "The tool shows the parser's error message (e.g. an unexpected token or trailing comma) so you can quickly locate and fix the issue.",
      },
      {
        question: "Can I choose the indentation size?",
        answer: "Yes — switch between 2 spaces, 4 spaces, or tabs from the dropdown above the input.",
      },
    ],
    keywords: ["json formatter", "json validator", "json beautifier", "json minifier", "pretty print json"],
  },
  "json-diff": {
    title: "JSON Diff — Compare Two JSON Documents Online",
    description:
      "Compare two JSON documents and instantly see what was added, removed, or changed. Free, client-side JSON diff tool with a clear line-by-line breakdown.",
    intro: [
      "JSON Diff compares two JSON objects or arrays field by field and highlights exactly what changed — additions in green, removals in red, and modified values shown side by side.",
      "It's built for the everyday task of comparing API responses, config files, or test fixtures before and after a change, without needing to eyeball two blocks of text.",
    ],
    faq: [
      {
        question: "How does the comparison handle arrays?",
        answer: "Array items are compared by index, so reordering a list will show as changes at each shifted index rather than a single move.",
      },
      {
        question: "Can I see unchanged fields too?",
        answer: "Yes — toggle \"Show unchanged\" to include fields that are identical in both documents for full context.",
      },
      {
        question: "Does this tool send my data anywhere?",
        answer: "No, the diff is computed entirely in your browser.",
      },
    ],
    keywords: ["json diff", "compare json", "json comparison tool", "json difference checker"],
  },
  "json-to-typescript": {
    title: "JSON to TypeScript — Generate Interfaces Online",
    description:
      "Convert a JSON sample into TypeScript interfaces instantly. Free online codegen tool that infers types, nested objects, and arrays — runs entirely in your browser.",
    intro: [
      "Paste a JSON response or config sample and get back matching TypeScript interfaces, including nested object types and inferred array element types.",
      "This is especially useful when working against an API that has no published types — sketch out interfaces in seconds instead of hand-writing them from a sample payload.",
    ],
    faq: [
      {
        question: "How are nested objects handled?",
        answer: "Each nested object becomes its own named interface, referenced from its parent, instead of one deeply inlined type.",
      },
      {
        question: "What happens with arrays of mixed types?",
        answer: "The generator creates a union type of the element types it found, e.g. (string | number)[].",
      },
      {
        question: "Can I change the root interface name?",
        answer: "Yes — set it in the \"Root type name\" field before copying the output.",
      },
    ],
    keywords: ["json to typescript", "generate typescript interface", "json to interface", "typescript codegen"],
  },
  "json-to-zod": {
    title: "JSON to Zod — Generate Zod Schemas Online",
    description:
      "Generate a Zod validation schema from a JSON sample in one click. Free online tool that infers object shapes, arrays, and primitive types for runtime validation.",
    intro: [
      "This tool turns a JSON sample into a ready-to-use Zod schema, so you can validate API responses, form data, or config at runtime instead of just typing them at compile time.",
      "It infers nested objects, arrays, and primitive types (string, number, boolean, null) automatically, saving you from hand-writing z.object({...}) calls.",
    ],
    faq: [
      {
        question: "Does the generated code include the Zod import?",
        answer: "Yes — the output includes `import { z } from \"zod\";` so you can paste it directly into a file.",
      },
      {
        question: "Can I rename the generated schema?",
        answer: "Yes, use the \"Schema name\" field to control the exported constant's name.",
      },
      {
        question: "Does it detect optional fields?",
        answer: "Fields with a `null` value in your sample are marked accordingly; fields present in every sample are treated as required.",
      },
    ],
    keywords: ["json to zod", "zod schema generator", "generate zod validation", "json to zod schema"],
  },
  "jwt-decoder": {
    title: "JWT Decoder — Decode JSON Web Tokens Online",
    description:
      "Decode a JWT's header, payload, and claims instantly. Free, client-side JWT decoder — your token is never sent to a server, and expiration is highlighted automatically.",
    intro: [
      "Paste a JSON Web Token to see its decoded header and payload, with temporal claims (iat, exp, nbf) converted to readable dates and a clear valid/expired indicator.",
      "Decoding happens entirely in your browser using the Web Crypto-safe base64url decoder built into JavaScript — the token, including its signature, is never transmitted anywhere.",
    ],
    faq: [
      {
        question: "Does this tool verify the signature?",
        answer:
          "No — it only decodes the header and payload, which doesn't require the signing secret. Signature verification requires the key and is intentionally not done here to avoid ever handling secrets.",
      },
      {
        question: "Is my token sent to a server?",
        answer: "No. Decoding is 100% client-side — nothing about your token leaves your browser.",
      },
      {
        question: "How is expiration determined?",
        answer: "The `exp` claim (seconds since epoch) is compared against the current time to show whether the token is valid or expired.",
      },
    ],
    keywords: ["jwt decoder", "decode jwt", "jwt parser", "json web token decoder"],
  },
  "uuid-generator": {
    title: "UUID Generator — Generate UUID v4 & v7 Online",
    description:
      "Generate random UUID v4 or time-ordered UUID v7 identifiers online, in bulk. Free, client-side generator with one-click copy and download.",
    intro: [
      "Generate cryptographically random UUID v4 identifiers, or time-ordered UUID v7 identifiers (better for database index locality), one at a time or in batches of up to 1000.",
      "All UUIDs are generated locally using your browser's secure random number generator — nothing is requested from a server, so there's no rate limit and no network delay.",
    ],
    faq: [
      {
        question: "What's the difference between UUID v4 and v7?",
        answer:
          "v4 is fully random. v7 embeds a timestamp in its most significant bits, so v7 values sort roughly chronologically — useful as database primary keys to avoid index fragmentation.",
      },
      {
        question: "How many UUIDs can I generate at once?",
        answer: "Up to 1000 per batch, with options to strip hyphens or uppercase the output.",
      },
      {
        question: "Are these UUIDs guaranteed unique?",
        answer: "They're generated with a cryptographically secure random source, making collisions astronomically unlikely — the same guarantee any standard UUID library provides.",
      },
    ],
    keywords: ["uuid generator", "generate uuid", "uuid v4 generator", "uuid v7 generator", "guid generator"],
  },
  "regex-tester": {
    title: "Regex Tester — Test Regular Expressions Online",
    description:
      "Test regular expressions against sample text with live highlighting, capture groups, and a plain-language breakdown of your pattern. Free and runs entirely client-side.",
    intro: [
      "Write a regular expression and see matches highlighted in your test text in real time, along with every capture group for each match.",
      "A basic explanation panel breaks your pattern down token by token, and a set of common example patterns (email, URL, IPv4, hex color) helps you get started quickly.",
    ],
    faq: [
      {
        question: "Which regex flavor does this use?",
        answer: "JavaScript's native RegExp engine (ECMAScript), the same one used by Node.js and every modern browser.",
      },
      {
        question: "Can I see named or numbered capture groups?",
        answer: "Yes — every match lists its numbered capture groups below the highlighted text.",
      },
      {
        question: "Does the explanation cover every regex feature?",
        answer: "It covers the most common tokens (anchors, character classes, quantifiers, groups) — it's meant as a quick reference, not a full parser.",
      },
    ],
    keywords: ["regex tester", "regular expression tester", "regex online", "test regex", "regex debugger"],
  },
  "cron-generator": {
    title: "Cron Expression Generator — Build & Explain Cron Syntax",
    description:
      "Build cron expressions visually with a plain-language explanation. Free online cron generator with common presets — no more guessing field order.",
    intro: [
      "Set minute, hour, day-of-month, month, and day-of-week fields with simple inputs, and get both the resulting cron expression and a human-readable explanation of when it runs.",
      "Common presets (every 5 minutes, daily at 2am, every Monday) are one click away, so you rarely need to write a cron expression from scratch.",
    ],
    faq: [
      {
        question: "What format does this generator use?",
        answer: "The standard 5-field cron format: minute, hour, day-of-month, month, day-of-week — supported by cron, crontab, and most job schedulers.",
      },
      {
        question: "Can I use step values like */5?",
        answer: "Yes — enter `*/5` in any field for \"every 5 units\", or use commas and ranges (e.g. `1,15` or `9-17`).",
      },
      {
        question: "Does it support 6-field cron (with seconds)?",
        answer: "Not currently — this tool targets the standard 5-field format used by most Unix cron implementations.",
      },
    ],
    keywords: ["cron generator", "crontab generator", "cron expression builder", "cron syntax", "cron schedule"],
  },
  "timestamp-converter": {
    title: "Unix Timestamp Converter — Epoch to Date Online",
    description:
      "Convert between Unix timestamps and human-readable dates instantly. Free online tool supporting seconds and milliseconds, ISO 8601, UTC, and relative time.",
    intro: [
      "Convert a Unix timestamp (in seconds or milliseconds) to a readable date, or go the other way from a date picker back to a timestamp.",
      "Results are shown in ISO 8601, UTC, your local timezone, and as a relative time (\"in 3 days\") — everything computed instantly in your browser.",
    ],
    faq: [
      {
        question: "Does this handle both seconds and milliseconds?",
        answer: "Yes — toggle the unit next to the timestamp field depending on whether your value is in seconds or milliseconds since the epoch.",
      },
      {
        question: "What timezone is used?",
        answer: "The \"Local\" result uses your browser's local timezone; ISO 8601 and UTC results are timezone-independent.",
      },
      {
        question: "Can I convert a date back to a timestamp?",
        answer: "Yes — use the date/time picker below the timestamp field to go in the other direction.",
      },
    ],
    keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "date to timestamp"],
  },
  "base64-encoder": {
    title: "Base64 Encoder / Decoder — Free Online Tool",
    description:
      "Encode text to Base64 or decode Base64 back to plain text, with correct UTF-8 handling. Free, client-side tool — nothing you type is sent to a server.",
    intro: [
      "Encode any text to Base64, or decode a Base64 string back to plain text — with full UTF-8 support, so accented characters and emoji round-trip correctly.",
      "Encoding and decoding both happen locally in your browser, which matters when working with tokens or credentials you don't want touching a network request.",
    ],
    faq: [
      {
        question: "Does this handle UTF-8 correctly?",
        answer: "Yes — text is encoded to UTF-8 bytes before Base64 encoding, so non-ASCII characters decode back correctly rather than becoming garbled.",
      },
      {
        question: "What happens if I paste invalid Base64?",
        answer: "The tool shows an error message instead of silently producing garbage output.",
      },
      {
        question: "Can I quickly switch between encoding and decoding?",
        answer: "Yes — use the Swap button to move the current output into the input and flip modes.",
      },
    ],
    keywords: ["base64 encoder", "base64 decoder", "base64 converter", "encode base64 online"],
  },
  "url-encoder": {
    title: "URL Encoder / Decoder — Percent-Encoding Online",
    description:
      "Encode or decode URLs and query string components online. Free tool supporting both encodeURIComponent and encodeURI (full URL) modes.",
    intro: [
      "Percent-encode text for safe use in a URL, or decode an already-encoded URL back to readable text.",
      "Component mode (encodeURIComponent) escapes reserved characters like & and = for use inside a query parameter; full URL mode (encodeURI) leaves URL structure characters intact.",
    ],
    faq: [
      {
        question: "What's the difference between component and full URL mode?",
        answer:
          "Component mode escapes every reserved character, which is correct for a single query parameter value. Full URL mode leaves characters like :/?& untouched, since they're structurally meaningful in a complete URL.",
      },
      {
        question: "Can I decode an already-encoded URL?",
        answer: "Yes — switch to Decode mode and paste the encoded string.",
      },
    ],
    keywords: ["url encoder", "url decoder", "percent encoding", "uri encode online", "query string encoder"],
  },
  "sql-formatter": {
    title: "SQL Formatter — Format & Beautify SQL Online",
    description:
      "Format and minify SQL queries online for PostgreSQL, MySQL, SQLite, and SQL Server. Free client-side SQL formatter with keyword casing options.",
    intro: [
      "Paste a SQL query — however it was written — and get back consistently indented, readable SQL, formatted for your chosen dialect.",
      "Supports PostgreSQL, MySQL, SQLite, and SQL Server (T-SQL), with an option to force keyword casing and a one-click minify for the reverse operation.",
    ],
    faq: [
      {
        question: "Which SQL dialects are supported?",
        answer: "PostgreSQL, MySQL, SQLite, and SQL Server (T-SQL) — pick the dialect closest to your database engine from the dropdown.",
      },
      {
        question: "Does formatting change my query's behavior?",
        answer: "No — only whitespace and keyword casing change; the query logic is untouched.",
      },
      {
        question: "Can I minify a formatted query back down?",
        answer: "Yes — the Minify button collapses formatted SQL back into a single line.",
      },
    ],
    keywords: ["sql formatter", "sql beautifier", "format sql online", "sql minifier", "sql pretty print"],
  },
  "html-encoder": {
    title: "HTML Encoder / Decoder — Escape & Unescape HTML Entities Online",
    description:
      "Encode text to HTML entities or decode HTML entities back to plain text. Free, client-side tool — nothing you type is sent to a server.",
    intro: [
      "Escape reserved HTML characters (&, <, >, \", ') so text can be safely embedded inside HTML markup, or decode an already-escaped string back to readable text.",
      "Decoding uses the browser's own HTML parser, so every standard named entity (like &nbsp; or &copy;) is handled correctly, not just the five basic ones.",
    ],
    faq: [
      {
        question: "Which characters does encoding escape?",
        answer: "By default: & < > \" ' — the characters that are structurally meaningful in HTML. An option lets you also convert every non-ASCII character to a numeric entity.",
      },
      {
        question: "Does decoding handle named entities like &nbsp; or &copy;?",
        answer: "Yes — decoding runs through the browser's built-in HTML parser, so the full standard set of named and numeric entities is supported.",
      },
      {
        question: "Is my input sent to a server?",
        answer: "No. Both encoding and decoding happen entirely in your browser.",
      },
    ],
    keywords: ["html encoder", "html decoder", "html entities", "escape html", "unescape html"],
  },
  "yaml-json-converter": {
    title: "YAML to JSON Converter — Convert Both Ways Online",
    description:
      "Convert YAML to JSON or JSON to YAML instantly. Free, client-side converter — paste either format and get clean, indented output in the other.",
    intro: [
      "Paste a YAML document to get its JSON equivalent, or paste JSON to get back readable YAML — useful when moving config between tools that expect one format or the other (Kubernetes manifests, CI configs, API payloads).",
      "Conversion runs entirely in your browser using the same YAML parser many Node.js tools rely on, so nested objects, arrays, and scalars round-trip correctly.",
    ],
    faq: [
      {
        question: "Which direction does the converter run?",
        answer: "Both — switch between \"YAML → JSON\" and \"JSON → YAML\" with the toggle above the input.",
      },
      {
        question: "What happens if my YAML or JSON is invalid?",
        answer: "The parser's error message is shown directly, so you can locate the problem line.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No — parsing and conversion happen entirely client-side.",
      },
    ],
    keywords: ["yaml to json", "json to yaml", "yaml converter", "yaml json converter online"],
  },
  "xml-json-converter": {
    title: "XML to JSON Converter — Convert Both Ways Online",
    description:
      "Convert XML to JSON or JSON to XML instantly. Free, client-side converter that preserves attributes, nested elements, and repeated tags as arrays.",
    intro: [
      "Paste an XML document to get its JSON equivalent, with attributes mapped to @-prefixed keys and text content to #text, or go the other way from a single-root JSON object back to XML.",
      "Conversion runs entirely in your browser using the native DOMParser, so nothing you paste is sent anywhere.",
    ],
    faq: [
      {
        question: "How are XML attributes represented in JSON?",
        answer: "Each attribute becomes a key prefixed with @ (e.g. <user id=\"1\"> becomes \"@id\": \"1\"), and element text content becomes a #text key when the element also has attributes or children.",
      },
      {
        question: "What happens with repeated sibling tags?",
        answer: "Repeated tags at the same level are collected into a JSON array under that tag's key.",
      },
      {
        question: "Does JSON → XML require a specific shape?",
        answer: "Yes — the JSON must have exactly one root key, since XML documents require a single root element.",
      },
    ],
    keywords: ["xml to json", "json to xml", "xml converter", "xml json converter online"],
  },
  "hash-generator": {
    title: "Hash Generator — MD5, SHA-1, SHA-256, SHA-512 Online",
    description:
      "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text, instantly and entirely in your browser.",
    intro: [
      "Type or paste any text to get its MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hash side by side — useful for verifying file integrity, checking checksums, or generating identifiers for legacy systems.",
      "SHA hashes are computed with the browser's native Web Crypto API; MD5 (not part of that API, but still widely requested for legacy compatibility) uses a well-tested standalone implementation. Nothing you type ever leaves your device.",
    ],
    faq: [
      {
        question: "Is MD5 still secure?",
        answer:
          "No — MD5 is cryptographically broken and shouldn't be used for security purposes (passwords, signatures). It's included here for legacy checksum compatibility only; prefer SHA-256 or SHA-512 for anything security-sensitive.",
      },
      {
        question: "Is my text sent to a server?",
        answer: "No. All hashing happens locally in your browser — nothing you type is ever transmitted.",
      },
      {
        question: "Can I hash a file, not just text?",
        answer: "Not yet — this tool hashes typed or pasted text. File hashing may be added later.",
      },
    ],
    keywords: ["hash generator", "md5 generator", "sha256 generator", "sha1 online", "checksum tool"],
  },
  "color-converter": {
    title: "Color Converter — HEX, RGB, HSL, OKLCH Online",
    description:
      "Convert colors between HEX, RGB, HSL, and OKLCH instantly. Paste any format or pick a color — see it converted to every other format at once.",
    intro: [
      "Paste a color in HEX, rgb(), or hsl() notation — or pick one visually — and see it instantly converted to HEX, RGB, HSL, and OKLCH, the newer perceptually-uniform color space increasingly used in modern CSS.",
      "Everything runs client-side using standard, published conversion formulas — nothing you enter is sent anywhere.",
    ],
    faq: [
      {
        question: "What is OKLCH and why would I use it?",
        answer:
          "OKLCH is a perceptually uniform color space — equal changes in its values look like equal changes to the human eye, which makes it easier to build consistent color scales than with HSL. It's supported in all modern browsers as a native CSS color function.",
      },
      {
        question: "Which input formats are supported?",
        answer: "HEX (#abc or #aabbcc), rgb()/rgba(), and hsl()/hsla(). OKLCH is available as an output for now.",
      },
      {
        question: "Is my color data sent to a server?",
        answer: "No — parsing and conversion happen entirely in your browser.",
      },
    ],
    keywords: ["color converter", "hex to rgb", "rgb to hsl", "hex to oklch", "color picker", "oklch converter"],
  },
  "csv-json-converter": {
    title: "CSV to JSON Converter — Convert Both Ways Online",
    description:
      "Convert CSV to JSON or JSON to CSV instantly. Free, client-side converter that correctly handles quoted fields, embedded commas, and newlines.",
    intro: [
      "Paste CSV with a header row to get an array of JSON objects, or paste a JSON array of objects to get back a CSV file — useful for moving data between spreadsheets, APIs, and databases.",
      "The parser correctly handles quoted fields, escaped quotes, and commas or newlines embedded inside quoted values, and everything runs entirely in your browser.",
    ],
    faq: [
      {
        question: "Does it handle quoted fields with commas inside them?",
        answer: "Yes — fields wrapped in double quotes can safely contain commas, newlines, and escaped (\"\") quotes.",
      },
      {
        question: "What's used as the JSON key names?",
        answer: "The first row of the CSV is treated as the header and becomes each object's keys.",
      },
      {
        question: "What shape does JSON → CSV expect?",
        answer: "A JSON array of flat objects. The column list is built from the union of all keys across every object.",
      },
    ],
    keywords: ["csv to json", "json to csv", "csv converter", "csv json converter online"],
  },
  "password-generator": {
    title: "Password Generator — Strong, Random Passwords Online",
    description:
      "Generate strong, random passwords with a customizable length and character set, using your browser's cryptographically secure random number generator.",
    intro: [
      "Generate random passwords of any length from 6 to 64 characters, choosing which character sets to include — uppercase, lowercase, numbers, and symbols — with a live entropy estimate and strength rating.",
      "Passwords are generated locally using the Web Crypto API's cryptographically secure random number generator, with rejection sampling to avoid modulo bias — nothing is ever sent to a server, and nothing is stored.",
    ],
    faq: [
      {
        question: "Is this password generator secure?",
        answer:
          "Yes — it uses crypto.getRandomValues(), the browser's cryptographically secure random number source, not Math.random(). Passwords are generated locally and never transmitted or stored.",
      },
      {
        question: "How is the strength estimate calculated?",
        answer:
          "As entropy in bits: password length × log2(character set size). It's a standard measure of how many guesses a brute-force attack would need on average.",
      },
      {
        question: "Why would I uncheck a character set?",
        answer: "Some systems restrict which characters passwords can contain — uncheck symbols, for example, if a form rejects them.",
      },
    ],
    keywords: ["password generator", "random password", "secure password generator", "strong password"],
  },
};
