export type ToolMatch = {
  slug: string;
  reason: string;
};

const SQL_KEYWORDS = /\b(select\s+.+\s+from|insert\s+into|update\s+\w+\s+set|delete\s+from|create\s+table|alter\s+table)\b/i;
const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNCTIONAL_COLOR = /^(rgb|rgba|hsl|hsla|oklch)\(/i;

/**
 * Ranked guesses at which tool a pasted blob of text belongs to. Order is
 * priority (most specific / least ambiguous first) since the UI only shows
 * the top few. Kept dependency-free so it can run on every keystroke.
 */
export function detectContent(raw: string): ToolMatch[] {
  const text = raw.trim();
  if (!text) return [];
  const matches: ToolMatch[] = [];

  if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(text) && text.length > 20) {
    matches.push({ slug: "jwt-decoder", reason: "Looks like a JWT" });
  }

  let isJson = false;
  if (/^[[{]/.test(text)) {
    try {
      JSON.parse(text);
      isJson = true;
    } catch {
      // not valid JSON — fall through to other detectors
    }
  }
  if (isJson) {
    matches.push({ slug: "json-formatter", reason: "Valid JSON" });
    matches.push({ slug: "json-to-typescript", reason: "Generate TypeScript types" });
    matches.push({ slug: "json-to-zod", reason: "Generate a Zod schema" });
  }

  if (!isJson && /^<[?!]?[a-zA-Z]/.test(text) && /<\/[a-zA-Z][\w:-]*>\s*$/.test(text)) {
    matches.push({ slug: "xml-json-converter", reason: "Looks like XML" });
  }

  if (SQL_KEYWORDS.test(text)) {
    matches.push({ slug: "sql-formatter", reason: "Looks like SQL" });
  }

  if (HEX_COLOR.test(text) || FUNCTIONAL_COLOR.test(text)) {
    matches.push({ slug: "color-converter", reason: "Looks like a color value" });
  }

  if (/%[0-9a-f]{2}.*%[0-9a-f]{2}/i.test(text) || (text.includes("%") && /%[0-9a-f]{2}/i.test(text))) {
    matches.push({ slug: "url-encoder", reason: "Contains percent-encoding" });
  }

  if (/&[a-z]+;|&#\d+;/i.test(text)) {
    matches.push({ slug: "html-encoder", reason: "Contains HTML entities" });
  }

  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!isJson && lines.length >= 2) {
    const columnCounts = lines.slice(0, 6).map((line) => line.split(",").length);
    if (columnCounts[0] > 1 && columnCounts.every((count) => count === columnCounts[0])) {
      matches.push({ slug: "csv-json-converter", reason: "Looks like CSV" });
    }
  }

  if (!isJson && matches.every((m) => m.slug !== "csv-json-converter")) {
    const looksYaml = /^---/.test(text) || (/^[\w.-]+:\s?.*$/m.test(text) && !/^https?:\/\//i.test(text));
    if (looksYaml && lines.length >= 1 && !text.includes("{")) {
      matches.push({ slug: "yaml-json-converter", reason: "Looks like YAML" });
    }
  }

  if (/^\/.*\/[gimsuy]*$/.test(text) && text.length > 2) {
    matches.push({ slug: "regex-tester", reason: "Looks like a regex literal" });
  }

  if (matches.length === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(text) && text.length % 4 === 0 && text.length >= 8) {
    matches.push({ slug: "base64-encoder", reason: "Looks like Base64" });
  }

  return matches;
}

/** Shapes the raw pasted text into whatever payload the target tool's restore hook expects. */
export function buildRestorePayload(slug: string, text: string): string {
  switch (slug) {
    case "json-diff":
      return JSON.stringify({ left: "", right: text });
    case "regex-tester":
      return JSON.stringify({ pattern: "", flags: "g", testString: text });
    default:
      return text;
  }
}
