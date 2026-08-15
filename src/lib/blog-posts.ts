import type { ContentBlock } from "@/lib/content-blocks";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  body: ContentBlock[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "debugging-jwts-without-a-server",
    title: "Debugging JWTs without sending them to a server",
    description:
      "Why pasting a production access token into a random website is a bad idea, and what to check when a JWT-based auth flow misbehaves.",
    date: "2026-06-02",
    tags: ["JWT", "Security", "Auth"],
    body: [
      {
        type: "paragraph",
        text: "A JWT is not encrypted. The header and payload are just base64url-encoded JSON — anyone who has the token can read every claim inside it without knowing the signing secret. That's fine for its intended use (an app reading its own token), but it means a JWT should be treated exactly like a password: it should never be pasted into a tool you don't trust, because \"decoding\" a JWT is functionally identical to reading it in plaintext.",
      },
      {
        type: "paragraph",
        text: "This is the whole reason our JWT Decoder runs entirely in the browser — the token never leaves your machine, there's no network request to inspect it, and it works the same with your laptop offline. When you're debugging an auth issue, that matters: you're often pasting a real, currently-valid production token.",
      },
      { type: "heading", text: "What to check first" },
      {
        type: "list",
        items: [
          "`exp` (expiry) — the single most common cause of \"random\" 401s. Compare it against the current Unix time, not against when the token was issued.",
          "`iat` and `nbf` — a token issued in the future (clock skew between services) will be rejected by strict verifiers.",
          "`iss` and `aud` — a token minted for one service but presented to another will fail audience checks, and the error message rarely says so explicitly.",
          "The algorithm in the header (`alg`). If it says `none`, or if it doesn't match what your verifier expects (`HS256` vs `RS256`), that's a configuration bug, not a token bug.",
        ],
      },
      { type: "heading", text: "What decoding won't tell you" },
      {
        type: "paragraph",
        text: "A decoder shows you the claims, but it can't tell you whether the signature is valid — that requires the verifying secret or public key, which the decoder deliberately never asks for. If the payload looks correct but requests still fail with an auth error, the signature (or the verifier's key configuration) is almost always the actual problem, not the claims.",
      },
      {
        type: "paragraph",
        text: "Try it on the JSON Formatter's sibling tool: paste a token into the JWT Decoder and check `exp` first — it catches the majority of real-world \"my login broke\" reports.",
      },
    ],
  },
  {
    slug: "json-schema-vs-zod",
    title: "JSON Schema vs Zod: picking a validation strategy",
    description:
      "Two different ways to describe the shape of your data — one is a portable spec, the other is TypeScript-first runtime validation. Here's how to choose.",
    date: "2026-06-16",
    tags: ["JSON", "TypeScript", "Validation"],
    body: [
      {
        type: "paragraph",
        text: "JSON Schema and Zod solve overlapping problems — both describe \"what shape should this data have\" — but they come from different worlds, and picking the wrong one for the job usually shows up later as duplicated logic.",
      },
      { type: "heading", text: "JSON Schema" },
      {
        type: "paragraph",
        text: "JSON Schema is a language-agnostic specification: a JSON document that describes another JSON document. It's the right choice when the schema needs to be understood outside your codebase — OpenAPI specs, form generators, cross-language validation (a Python service and a Node service validating against the same contract), or anywhere the schema itself needs to be data (stored, versioned, transmitted).",
      },
      { type: "heading", text: "Zod" },
      {
        type: "paragraph",
        text: "Zod is a TypeScript-first runtime validator: you write `z.object({...})` and get both a runtime validator and a static TypeScript type from the same declaration via `z.infer<typeof schema>`. It's the right choice when the schema lives and dies inside a single TypeScript codebase — validating an API response body, a form submission, or environment variables — because you get type inference for free instead of maintaining a `.d.ts` file by hand.",
      },
      { type: "heading", text: "A practical rule of thumb" },
      {
        type: "list",
        items: [
          "Building an API other teams or services will consume? Reach for JSON Schema (often via OpenAPI).",
          "Validating data at the edges of a single TypeScript app (API responses, form input, config)? Reach for Zod.",
          "Need both — a portable spec and inferred TypeScript types? Generate one from the other rather than hand-maintaining two schemas that will eventually drift.",
        ],
      },
      {
        type: "paragraph",
        text: "That last point is why we built the JSON to Zod tool: paste a real JSON sample from an API response and get a starting Zod schema, instead of writing the boilerplate by hand and hoping it matches what the API actually returns.",
      },
    ],
  },
  {
    slug: "cron-expression-mistakes",
    title: "Six cron expression mistakes everyone makes",
    description:
      "Cron syntax is small but unforgiving. These are the mistakes that quietly turn 'every hour' into 'once a year'.",
    date: "2026-07-01",
    tags: ["Cron", "Scheduling", "DevOps"],
    body: [
      {
        type: "paragraph",
        text: "Cron expressions have five fields and roughly a dozen operators, which makes them look simple enough to write by hand — right up until a job runs at the wrong time, or not at all, and nobody notices for a week.",
      },
      { type: "heading", text: "1. Mixing up day-of-month and day-of-week" },
      {
        type: "paragraph",
        text: "`0 0 1 * *` runs on the 1st of every month. `0 0 * * 1` runs every Monday. They differ by one character and mean completely different things — this is the single most common copy-paste bug in cron expressions.",
      },
      { type: "heading", text: "2. Forgetting that day-of-month and day-of-week are OR'd, not AND'd" },
      {
        type: "paragraph",
        text: "`0 0 1 * 1` doesn't mean \"the 1st, if it's a Monday\" — most cron implementations treat this as \"the 1st of the month, OR any Monday,\" which fires far more often than intended.",
      },
      { type: "heading", text: "3. Assuming the schedule runs in local time" },
      {
        type: "paragraph",
        text: "Most schedulers (crontab, many cloud cron services) default to UTC or the host's system timezone, not the timezone the person writing the schedule was thinking in. A job meant to run \"at 9am\" can silently run at 9am UTC instead.",
      },
      { type: "heading", text: "4. Using `*/N` on a field that doesn't start at 0" },
      {
        type: "paragraph",
        text: "`*/5` in the minutes field means \"every 5 minutes starting from :00\" — it does not mean \"5 minutes after whenever the job was created.\" Assuming the offset is arbitrary is a common source of confusion when comparing two `*/N` schedules that don't seem to line up.",
      },
      { type: "heading", text: "5. Off-by-one on Sunday" },
      {
        type: "paragraph",
        text: "The day-of-week field is usually 0–6, but which end is Sunday depends on the implementation — some treat 0 as Sunday, others treat 7 as Sunday (and a few accept both). If a weekly job is running on the wrong day, this is the first thing to check.",
      },
      { type: "heading", text: "6. Writing the expression instead of reading it back in plain English" },
      {
        type: "paragraph",
        text: "The fastest way to catch all five mistakes above is to translate the expression into a sentence before deploying it — \"at minute 0 past hour 0 on day-of-month 1\" reads very differently from what you intended if you meant \"every Monday.\" That's exactly what the Cron Generator's plain-language explanation is for: build the schedule visually, and let the explanation catch the mismatch before it ships.",
      },
    ],
  },
  {
    slug: "sql-formatting-style-guide",
    title: "A practical style guide for formatting SQL",
    description:
      "SQL doesn't enforce a style the way a compiler does — which is exactly why an inconsistent codebase full of one-line queries becomes unreadable fast.",
    date: "2026-07-21",
    tags: ["SQL", "Style", "Readability"],
    body: [
      {
        type: "paragraph",
        text: "Unlike most programming languages, SQL has no dominant formatter that everyone just runs (think Prettier for JS, gofmt for Go). The result is that SQL in most codebases is formatted however the person who last touched it felt like formatting it — which makes even simple queries slower to review than they should be.",
      },
      { type: "heading", text: "Keywords on their own line" },
      {
        type: "code",
        code: "SELECT\n  id,\n  email,\n  created_at\nFROM users\nWHERE status = 'active'\n  AND created_at > '2026-01-01'\nORDER BY created_at DESC;",
      },
      {
        type: "paragraph",
        text: "Putting major clauses (`SELECT`, `FROM`, `WHERE`, `ORDER BY`) at the start of their own line, left-aligned, makes a query's overall structure scannable in a fraction of a second — you can tell what's being selected, from where, and under what conditions without reading every token.",
      },
      { type: "heading", text: "One column per line once you have more than a couple" },
      {
        type: "paragraph",
        text: "A `SELECT` with two columns is fine on one line. A `SELECT` with eight columns crammed onto one line is not — diffs become unreadable, because adding one column at the end shows up as a change to the entire line in most diff tools. One column per line makes future diffs local to the column that actually changed.",
      },
      { type: "heading", text: "Uppercase keywords, lowercase identifiers" },
      {
        type: "paragraph",
        text: "This is a convention, not a requirement, but it's the most common one and worth adopting consistently: `SELECT`, `FROM`, `WHERE`, `JOIN` in caps; table and column names in lowercase (`users`, `created_at`). It gives an instant visual split between \"SQL syntax\" and \"your schema\" without needing syntax highlighting.",
      },
      { type: "heading", text: "Consistency matters more than any specific rule" },
      {
        type: "paragraph",
        text: "The exact rules above are less important than picking one convention and applying it everywhere — a codebase where every query follows the same shape is far easier to review than one that technically follows \"better\" individual choices inconsistently. The SQL Formatter supports PostgreSQL, MySQL, SQLite, and SQL Server dialects specifically so pasting in a real query from any of those engines produces consistent, reviewable output instead of a one-off manual cleanup.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
