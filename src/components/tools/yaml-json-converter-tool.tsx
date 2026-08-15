"use client";

import { CopyButton } from "@/components/copy-button";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { downloadTextFile, labelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { ArrowLeftRight, Download } from "lucide-react";
import * as yaml from "js-yaml";
import { useMemo, useState } from "react";

const SAMPLE_YAML = `name: Ada Lovelace\nborn: 1815\nskills:\n  - math\n  - programming\nactive: true\n`;

export function YamlJsonConverterTool() {
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [input, setInput] = useRestorableInput("yaml-json-converter", "");

  useHistoryDataRecorder("yaml-json-converter", input);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      if (mode === "yaml-to-json") {
        const parsed = yaml.load(input);
        return { output: JSON.stringify(parsed, null, 2), error: null };
      }
      const parsed = JSON.parse(input);
      return { output: yaml.dump(parsed, { indent: 2 }), error: null };
    } catch (err) {
      return { output: "", error: err instanceof Error ? err.message : "Invalid input" };
    }
  }, [input, mode]);

  function swap() {
    setMode((prev) => (prev === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json"));
    setInput(output);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-md border border-border">
          <button
            type="button"
            onClick={() => setMode("yaml-to-json")}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "yaml-to-json" ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground-muted hover:bg-surface-hover"
            }`}
          >
            YAML → JSON
          </button>
          <button
            type="button"
            onClick={() => setMode("json-to-yaml")}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "json-to-yaml" ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground-muted hover:bg-surface-hover"
            }`}
          >
            JSON → YAML
          </button>
        </div>
        <button type="button" onClick={swap} disabled={!output} className={secondaryButtonClass}>
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Swap
        </button>
        <button type="button" onClick={() => setInput(SAMPLE_YAML)} className={secondaryButtonClass}>
          Load sample
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>{mode === "yaml-to-json" ? "YAML" : "JSON"}</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode === "yaml-to-json" ? "name: Ada Lovelace\nborn: 1815" : '{\n  "name": "Ada Lovelace"\n}'}
            spellCheck={false}
            className={`${textareaClass} h-80`}
          />
          {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>{mode === "yaml-to-json" ? "JSON" : "YAML"}</label>
            <div className="flex items-center gap-2">
              <CopyButton value={output} />
              <button
                type="button"
                disabled={!output}
                onClick={() =>
                  downloadTextFile(
                    mode === "yaml-to-json" ? "converted.json" : "converted.yaml",
                    output,
                    mode === "yaml-to-json" ? "application/json" : "text/yaml"
                  )
                }
                className={secondaryButtonClass}
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Output will appear here..."
            className={`${textareaClass} h-80`}
          />
        </div>
      </div>
    </div>
  );
}
