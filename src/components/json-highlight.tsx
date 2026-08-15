function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const TOKEN_PATTERN = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

export function jsonToHtml(json: string): string {
  const escaped = escapeHtml(json);
  return escaped.replace(TOKEN_PATTERN, (match) => {
    let cls = "text-amber-600 dark:text-amber-400";
    if (/^"/.test(match)) {
      cls = /:$/.test(match) ? "text-accent" : "text-emerald-600 dark:text-emerald-400";
    } else if (match === "true" || match === "false") {
      cls = "text-sky-600 dark:text-sky-400";
    } else if (match === "null") {
      cls = "text-foreground-subtle italic";
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

export function JsonHighlight({ json, className }: { json: string; className?: string }) {
  return <pre className={className} dangerouslySetInnerHTML={{ __html: jsonToHtml(json) }} />;
}
