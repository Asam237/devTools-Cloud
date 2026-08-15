"use client";

import { CopyButton } from "@/components/copy-button";
import { JsonHighlight } from "@/components/json-highlight";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { downloadTextFile } from "@/lib/utils";
import { labelClass, panelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { Download, Minimize2, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const SAMPLE = `{"name":"Ada Lovelace","born":1815,"skills":["math","programming"],"active":true,"address":{"city":"London","country":"UK"}}`;

export function JsonFormatterTool() {
  const [input, setInput] = useRestorableInput("json-formatter", "");
  const [indent, setIndent] = useState(2);
  const [query, setQuery] = useState("");

  useHistoryDataRecorder("json-formatter", input);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      const parsed = JSON.parse(input);
      return { output: JSON.stringify(parsed, null, indent), error: null };
    } catch (err) {
      return { output: "", error: err instanceof Error ? err.message : "Invalid JSON" };
    }
  }, [input, indent]);

  function minify() {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch {
      // leave input untouched if invalid
    }
  }

  const matchCount = useMemo(() => {
    if (!query.trim() || !output) return 0;
    return output.toLowerCase().split(query.toLowerCase()).length - 1;
  }, [output, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setInput(SAMPLE)} className={secondaryButtonClass}>
          Load sample
        </button>
        <button type="button" onClick={minify} className={secondaryButtonClass}>
          <Minimize2 className="h-3.5 w-3.5" />
          Minify
        </button>
        <select
          value={indent}
          onChange={(event) => setIndent(Number(event.target.value))}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground-muted focus:border-accent focus:outline-none"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={0}>Tabs</option>
        </select>
        <button
          type="button"
          onClick={() => {
            setInput("");
            setQuery("");
          }}
          className={secondaryButtonClass}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
        <div className="ml-auto flex items-center gap-2">
          <CopyButton value={output} />
          <button
            type="button"
            disabled={!output}
            onClick={() => downloadTextFile("formatted.json", output, "application/json")}
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
            placeholder="Paste your JSON here..."
            spellCheck={false}
            className={`${textareaClass} h-96`}
          />
          {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>Formatted output</label>
            {output ? (
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-foreground-subtle" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search..."
                  className="w-32 rounded-md border border-border bg-background-subtle py-1 pl-6 pr-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
                {query ? (
                  <span className="ml-2 text-[10px] text-foreground-subtle">{matchCount} match{matchCount === 1 ? "" : "es"}</span>
                ) : null}
              </div>
            ) : null}
          </div>
          {output ? (
            <JsonHighlight
              json={output}
              className={`${panelClass} h-96 overflow-auto whitespace-pre-wrap wrap-break-word px-3.5 py-3 font-mono text-sm text-foreground`}
            />
          ) : (
            <div className={`${panelClass} h-96 px-3.5 py-3 font-mono text-sm text-foreground-subtle`}>
              Formatted JSON will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
