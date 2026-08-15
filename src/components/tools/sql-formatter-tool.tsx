"use client";

import { CopyButton } from "@/components/copy-button";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { downloadTextFile, labelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { Download, Minimize2 } from "lucide-react";
import { format } from "sql-formatter";
import { useMemo, useState } from "react";

const DIALECTS = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "transactsql", label: "SQL Server" },
] as const;

const SAMPLE = "select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.active = true group by u.id, u.name having count(o.id) > 0 order by orders desc limit 20;";

export function SqlFormatterTool() {
  const [input, setInput] = useRestorableInput("sql-formatter", "");
  const [dialect, setDialect] = useState<(typeof DIALECTS)[number]["value"]>("postgresql");
  const [uppercase, setUppercase] = useState(true);

  useHistoryDataRecorder("sql-formatter", input);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      return {
        output: format(input, { language: dialect, keywordCase: uppercase ? "upper" : "preserve" }),
        error: null,
      };
    } catch (err) {
      return { output: "", error: err instanceof Error ? err.message : "Could not format SQL" };
    }
  }, [input, dialect, uppercase]);

  function minify() {
    if (!output) return;
    setInput(output.replace(/\s+/g, " ").trim());
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setInput(SAMPLE)} className={secondaryButtonClass}>
          Load sample
        </button>
        <select
          value={dialect}
          onChange={(event) => setDialect(event.target.value as typeof dialect)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground-muted focus:border-accent focus:outline-none"
        >
          {DIALECTS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)} className="accent-accent" />
          Uppercase keywords
        </label>
        <button type="button" onClick={minify} className={secondaryButtonClass}>
          <Minimize2 className="h-3.5 w-3.5" />
          Minify
        </button>
        <div className="ml-auto flex items-center gap-2">
          <CopyButton value={output} />
          <button
            type="button"
            disabled={!output}
            onClick={() => downloadTextFile("formatted.sql", output, "text/plain")}
            className={secondaryButtonClass}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>Input</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Paste your SQL query here..."
            spellCheck={false}
            className={`${textareaClass} h-96`}
          />
          {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
        </div>
        <div>
          <label className={labelClass}>Formatted output</label>
          <pre className={`${textareaClass} h-96 overflow-auto whitespace-pre wrap-break-word bg-background-subtle`}>
            {output || <span className="text-foreground-subtle">Formatted SQL will appear here.</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
