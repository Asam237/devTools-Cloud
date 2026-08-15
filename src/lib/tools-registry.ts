import {
  Binary,
  Braces,
  Clock,
  Code2,
  Database,
  FileCode,
  FileCode2,
  FileJson2,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  GitCompare,
  Hash,
  KeyRound,
  Link2,
  Lock,
  type LucideIcon,
  Palette,
  Regex,
} from "lucide-react";

export type ToolCategory = "JSON" | "API & Security" | "Encoding" | "Conversion" | "SQL" | "Time";

export type ToolDefinition = {
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  keywords: string[];
  icon: LucideIcon;
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    shortDescription: "Format, minify, and validate JSON with syntax highlighting.",
    category: "JSON",
    keywords: ["json", "format", "beautify", "minify", "validate", "pretty print"],
    icon: Braces,
  },
  {
    slug: "json-diff",
    name: "JSON Diff",
    shortDescription: "Compare two JSON documents and see additions, removals, and changes.",
    category: "JSON",
    keywords: ["json", "diff", "compare"],
    icon: GitCompare,
  },
  {
    slug: "json-to-typescript",
    name: "JSON to TypeScript",
    shortDescription: "Generate TypeScript interfaces from a JSON sample.",
    category: "JSON",
    keywords: ["json", "typescript", "interface", "types", "codegen"],
    icon: FileCode2,
  },
  {
    slug: "json-to-zod",
    name: "JSON to Zod",
    shortDescription: "Generate a Zod validation schema from a JSON sample.",
    category: "JSON",
    keywords: ["json", "zod", "schema", "validation", "codegen"],
    icon: FileJson2,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortDescription: "Decode JWT header, payload, and claims — entirely in your browser.",
    category: "API & Security",
    keywords: ["jwt", "token", "decode", "auth", "claims"],
    icon: KeyRound,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    shortDescription: "Generate UUID v4 or v7 identifiers, one at a time or in bulk.",
    category: "API & Security",
    keywords: ["uuid", "guid", "generator", "id"],
    icon: Fingerprint,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    shortDescription: "Test regular expressions with live highlighting and capture groups.",
    category: "API & Security",
    keywords: ["regex", "regexp", "pattern", "test"],
    icon: Regex,
  },
  {
    slug: "cron-generator",
    name: "Cron Generator",
    shortDescription: "Build cron expressions visually with a plain-language explanation.",
    category: "API & Security",
    keywords: ["cron", "schedule", "crontab"],
    icon: Clock,
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    shortDescription: "Convert between Unix timestamps and human-readable dates.",
    category: "Time",
    keywords: ["timestamp", "unix", "epoch", "date", "time"],
    icon: Clock,
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder / Decoder",
    shortDescription: "Encode or decode Base64 text, safely handling UTF-8.",
    category: "Encoding",
    keywords: ["base64", "encode", "decode"],
    icon: Binary,
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    shortDescription: "Encode or decode URL components and query strings.",
    category: "Encoding",
    keywords: ["url", "uri", "encode", "decode", "percent encoding"],
    icon: Link2,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    shortDescription: "Format and minify SQL for PostgreSQL, MySQL, SQLite, and SQL Server.",
    category: "SQL",
    keywords: ["sql", "format", "postgres", "mysql", "sqlite", "sql server", "tsql"],
    icon: Database,
  },
  {
    slug: "html-encoder",
    name: "HTML Encoder / Decoder",
    shortDescription: "Encode text to HTML entities or decode HTML entities back to text.",
    category: "Encoding",
    keywords: ["html", "encode", "decode", "entities", "escape", "unescape"],
    icon: Code2,
  },
  {
    slug: "yaml-json-converter",
    name: "YAML ↔ JSON Converter",
    shortDescription: "Convert between YAML and JSON, in either direction.",
    category: "Conversion",
    keywords: ["yaml", "json", "convert", "yaml to json", "json to yaml"],
    icon: FileText,
  },
  {
    slug: "xml-json-converter",
    name: "XML ↔ JSON Converter",
    shortDescription: "Convert between XML and JSON, in either direction.",
    category: "Conversion",
    keywords: ["xml", "json", "convert", "xml to json", "json to xml"],
    icon: FileCode,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    shortDescription: "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text.",
    category: "API & Security",
    keywords: ["hash", "md5", "sha1", "sha256", "sha512", "checksum", "digest"],
    icon: Hash,
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    shortDescription: "Convert colors between HEX, RGB, HSL, and OKLCH.",
    category: "Conversion",
    keywords: ["color", "hex", "rgb", "hsl", "oklch", "convert", "picker"],
    icon: Palette,
  },
  {
    slug: "csv-json-converter",
    name: "CSV ↔ JSON Converter",
    shortDescription: "Convert between CSV and JSON, in either direction.",
    category: "Conversion",
    keywords: ["csv", "json", "convert", "csv to json", "json to csv", "spreadsheet"],
    icon: FileSpreadsheet,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDescription: "Generate strong, random passwords with a customizable character set.",
    category: "API & Security",
    keywords: ["password", "generator", "random", "secure", "strong password"],
    icon: Lock,
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export const TOOL_CATEGORIES: ToolCategory[] = ["JSON", "API & Security", "Encoding", "Conversion", "SQL", "Time"];
