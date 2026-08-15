import type { ContentBlock } from "@/lib/content-blocks";
import type { ToolFaq } from "@/lib/tool-seo";
import { TOOLS } from "@/lib/tools-registry";

export type DocsSection = {
  id: string;
  title: string;
  body: ContentBlock[];
};

export const DOCS_SECTIONS: DocsSection[] = [
  {
    id: "what-is-devtools-cloud",
    title: "What is DevTools Cloud",
    body: [
      {
        type: "paragraph",
        text: "DevTools Cloud is a free toolbox of everyday developer utilities — JSON formatting and diffing, JWT decoding, UUID generation, regex testing, cron building, timestamp conversion, encoding, and SQL formatting — accessible from a single site with no installation.",
      },
      {
        type: "paragraph",
        text: "There's no paywall on any of the free tools. Creating an account is optional and only unlocks saving your work across devices — every tool works fully without signing in.",
      },
    ],
  },
  {
    id: "client-side-first",
    title: "How your data is handled",
    body: [
      {
        type: "paragraph",
        text: "Every tool in the free toolbox — JSON Formatter, JSON Diff, JSON to TypeScript, JSON to Zod, JWT Decoder, UUID Generator, Regex Tester, Cron Generator, Timestamp Converter, Base64 Encoder, URL Encoder, and SQL Formatter — runs entirely in your browser. Nothing you paste into any of these tools is sent to a server.",
      },
      {
        type: "paragraph",
        text: "This matters most for the JWT Decoder, since real access tokens are frequently pasted in to debug an auth issue — decoding happens locally using the browser's own base64 and JSON APIs, with no network request involved.",
      },
      {
        type: "paragraph",
        text: "The one thing that is optionally sent to a server is your tool usage history, and only if you're signed in — see \"Local history vs. an account\" below.",
      },
    ],
  },
  {
    id: "command-palette",
    title: "Finding a tool fast",
    body: [
      {
        type: "paragraph",
        text: "Press ⌘K (or Ctrl+K on Windows/Linux) anywhere on the site to open the command palette, type part of a tool's name, and hit Enter to jump straight to it. It's also reachable by clicking the search bar in the header.",
      },
    ],
  },
  {
    id: "account-and-history",
    title: "Local history vs. an account",
    body: [
      {
        type: "paragraph",
        text: "Without signing in, the site keeps a short list of your recently used tools in your browser's local storage — visible from the Dashboard, cleared if you clear your browser data, and never sent anywhere.",
      },
      {
        type: "paragraph",
        text: "Signing in (via the account menu, using Firebase Authentication) creates a profile so that future features — saved projects, collections, and cross-device history — can be tied to your account. Signing in does not change how the free tools themselves process data; it only affects what gets saved and where.",
      },
    ],
  },
];

export const DOCS_FAQ: ToolFaq[] = [
  {
    question: "Do I need an account to use the tools?",
    answer: `No. All ${TOOLS.length} free tools work fully without signing in — an account only unlocks saving your work across devices in future releases.`,
  },
  {
    question: "Is any of my data sent to a server?",
    answer:
      "The free tools (JSON, JWT, UUID, regex, cron, timestamps, encoders, SQL formatting) run entirely in your browser and never send what you paste anywhere. Only your tool-usage history is optionally synced if you sign in.",
  },
  {
    question: "Is DevTools Cloud free?",
    answer:
      "Yes — every tool listed today is free with no usage limits. Paid tiers, when introduced, will add optional team and cloud-storage features on top, not gate the existing free tools.",
  },
  {
    question: "How do I report a bug or request a feature?",
    answer: "Use the feedback button in the bottom-right corner of any page — it takes a moment and goes straight to the team.",
  },
];
