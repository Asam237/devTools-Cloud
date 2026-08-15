"use client";

import { CopyButton } from "@/components/copy-button";
import { jsonToZod } from "@/lib/json-to-zod";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { inputClass, labelClass, panelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { useMemo, useState } from "react";

const SAMPLE = `{
  "name": "John",
  "age": 25,
  "isAdmin": false,
  "tags": ["dev", "ops"]
}`;

export function JsonToZodTool() {
  const [input, setInput] = useRestorableInput("json-to-zod", "");
  const [schemaName, setSchemaName] = useState("rootSchema");

  useHistoryDataRecorder("json-to-zod", input);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      const parsed = JSON.parse(input);
      return { output: jsonToZod(parsed, schemaName || "rootSchema"), error: null };
    } catch (err) {
      return { output: "", error: err instanceof Error ? err.message : "Invalid JSON" };
    }
  }, [input, schemaName]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setInput(SAMPLE)} className={secondaryButtonClass}>
          Load sample
        </button>
        <div className="flex items-center gap-2">
          <label className="text-xs text-foreground-muted">Schema name</label>
          <input
            value={schemaName}
            onChange={(event) => setSchemaName(event.target.value)}
            className={`${inputClass} w-40 py-1.5`}
          />
        </div>
        <div className="ml-auto">
          <CopyButton value={output} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>JSON input</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Paste a JSON sample..."
            spellCheck={false}
            className={`${textareaClass} h-96`}
          />
          {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
        </div>
        <div>
          <label className={labelClass}>Zod schema output</label>
          <pre className={`${panelClass} h-96 overflow-auto whitespace-pre-wrap wrap-break-word px-3.5 py-3 font-mono text-sm text-foreground`}>
            {output || <span className="text-foreground-subtle">Generated Zod schema will appear here.</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
