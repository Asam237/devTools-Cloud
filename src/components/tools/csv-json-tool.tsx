"use client";

import { CopyButton } from "@/components/copy-button";
import { csvToJson, jsonToCsv } from "@/lib/csv-json";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { downloadTextFile, labelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { ArrowLeftRight, Download } from "lucide-react";
import { useMemo, useState } from "react";

const SAMPLE_CSV = `name,born,active\nAda Lovelace,1815,true\nGrace Hopper,1906,true\n`;

export function CsvJsonTool() {
  const [mode, setMode] = useState<"csv-to-json" | "json-to-csv">("csv-to-json");
  const [input, setInput] = useRestorableInput("csv-json-converter", "");

  useHistoryDataRecorder("csv-json-converter", input);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      if (mode === "csv-to-json") {
        return { output: JSON.stringify(csvToJson(input), null, 2), error: null };
      }
      const parsed = JSON.parse(input);
      const csv = jsonToCsv(parsed);
      if (!csv) return { output: "", error: "Expected a JSON array of objects." };
      return { output: csv, error: null };
    } catch (err) {
      return { output: "", error: err instanceof Error ? err.message : "Invalid input" };
    }
  }, [input, mode]);

  function swap() {
    setMode((prev) => (prev === "csv-to-json" ? "json-to-csv" : "csv-to-json"));
    setInput(output);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-md border border-border">
          <button
            type="button"
            onClick={() => setMode("csv-to-json")}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "csv-to-json" ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground-muted hover:bg-surface-hover"
            }`}
          >
            CSV → JSON
          </button>
          <button
            type="button"
            onClick={() => setMode("json-to-csv")}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "json-to-csv" ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground-muted hover:bg-surface-hover"
            }`}
          >
            JSON → CSV
          </button>
        </div>
        <button type="button" onClick={swap} disabled={!output} className={secondaryButtonClass}>
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Swap
        </button>
        <button type="button" onClick={() => setInput(SAMPLE_CSV)} className={secondaryButtonClass}>
          Load sample
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>{mode === "csv-to-json" ? "CSV" : "JSON"}</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode === "csv-to-json" ? "name,born\nAda Lovelace,1815" : '[\n  { "name": "Ada Lovelace" }\n]'}
            spellCheck={false}
            className={`${textareaClass} h-80`}
          />
          {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>{mode === "csv-to-json" ? "JSON" : "CSV"}</label>
            <div className="flex items-center gap-2">
              <CopyButton value={output} />
              <button
                type="button"
                disabled={!output}
                onClick={() =>
                  downloadTextFile(
                    mode === "csv-to-json" ? "converted.json" : "converted.csv",
                    output,
                    mode === "csv-to-json" ? "application/json" : "text/csv"
                  )
                }
                className={secondaryButtonClass}
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
          <textarea readOnly value={output} placeholder="Output will appear here..." className={`${textareaClass} h-80`} />
        </div>
      </div>
    </div>
  );
}
