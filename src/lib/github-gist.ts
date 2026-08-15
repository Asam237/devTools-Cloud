import type { SnippetLanguage } from "@/lib/firebase/snippets";

export type GistFile = {
  filename: string;
  language: string | null;
  content: string;
};

export type GistResult = {
  id: string;
  description: string;
  htmlUrl: string;
  files: GistFile[];
};

type GistApiFile = { filename: string; language: string | null; content: string };
type GistApiResponse = {
  id: string;
  description: string | null;
  html_url: string;
  files: Record<string, GistApiFile>;
};

function extractGistId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[0-9a-f]+$/i.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (!url.hostname.includes("gist.github.com")) return null;
    const segments = url.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || null;
  } catch {
    return null;
  }
}

/** Fetches a public GitHub Gist client-side — GitHub's API allows unauthenticated GET with CORS, no proxy needed. */
export async function fetchGist(input: string): Promise<GistResult> {
  const id = extractGistId(input);
  if (!id) throw new Error("Enter a valid Gist ID or gist.github.com URL.");

  const response = await fetch(`https://api.github.com/gists/${id}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) {
    throw new Error(response.status === 404 ? "Gist not found — check the ID or URL." : `GitHub API error (${response.status})`);
  }

  const data = (await response.json()) as GistApiResponse;
  const files = Object.values(data.files ?? {}).map((file) => ({
    filename: file.filename,
    language: file.language ?? null,
    content: file.content ?? "",
  }));
  if (files.length === 0) throw new Error("This Gist has no files.");

  return { id: data.id, description: data.description ?? "", htmlUrl: data.html_url, files };
}

const GIST_LANGUAGE_MAP: Record<string, SnippetLanguage> = {
  JavaScript: "JavaScript",
  TypeScript: "TypeScript",
  Python: "Python",
  PHP: "PHP",
  SQL: "SQL",
  Shell: "Bash",
  CSS: "CSS",
  HTML: "HTML",
  Go: "Go",
  Rust: "Rust",
  Java: "Java",
  "C++": "C++",
  "C#": "C#",
  Ruby: "Ruby",
  Markdown: "Markdown",
  JSON: "JSON",
  YAML: "YAML",
};

export function mapGistLanguage(language: string | null): SnippetLanguage {
  if (!language) return "Other";
  return GIST_LANGUAGE_MAP[language] ?? "Other";
}
