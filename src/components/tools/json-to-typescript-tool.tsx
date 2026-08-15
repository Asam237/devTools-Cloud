"use client";

import { CopyButton } from "@/components/copy-button";
import { jsonToTypeScript } from "@/lib/json-to-typescript";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { inputClass, labelClass, panelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { useMemo, useState } from "react";

const SAMPLE = `{
  "name": "John",
  "age": 25,
  "isAdmin": false,
  "tags": ["dev", "ops"],
  "address": {
    "city": "Paris",
    "zip": "75000"
  }
}`;

export function JsonToTypeScriptTool() {
  const [input, setInput] = useRestorableInput("json-to-typescript", "");
  const [rootName, setRootName] = useState("Root");

  useHistoryDataRecorder("json-to-typescript", input);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      const parsed = JSON.parse(input);
      return { output: jsonToTypeScript(parsed, rootName || "Root"), error: null };
    } catch (err) {
      return { output: "", error: err instanceof Error ? err.message : "Invalid JSON" };
    }
  }, [input, rootName]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setInput(SAMPLE)} className={secondaryButtonClass}>
          Load sample
        </button>
        <div className="flex items-center gap-2">
          <label className="text-xs text-foreground-muted">Root type name</label>
          <input
            value={rootName}
            onChange={(event) => setRootName(event.target.value)}
            className={`${inputClass} w-32 py-1.5`}
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
          <label className={labelClass}>TypeScript output</label>
          <pre className={`${panelClass} h-96 overflow-auto whitespace-pre-wrap wrap-break-word px-3.5 py-3 font-mono text-sm text-foreground`}>
            {output || <span className="text-foreground-subtle">Generated interfaces will appear here.</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
