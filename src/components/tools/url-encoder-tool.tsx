"use client";

import { CopyButton } from "@/components/copy-button";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { inputClass, labelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";
import { useMemo, useState } from "react";

export function UrlEncoderTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [component, setComponent] = useState(true);
  const [input, setInput] = useRestorableInput("url-encoder", "");

  useHistoryDataRecorder("url-encoder", input);

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      if (mode === "encode") {
        return { output: component ? encodeURIComponent(input) : encodeURI(input), error: null };
      }
      return { output: component ? decodeURIComponent(input) : decodeURI(input), error: null };
    } catch {
      return { output: "", error: "Invalid input for URL decoding." };
    }
  }, [input, mode, component]);

  function swap() {
    setMode((prev) => (prev === "encode" ? "decode" : "encode"));
    setInput(output);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded-md border border-border">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 text-sm capitalize transition-colors ${
                mode === m ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground-muted hover:bg-surface-hover"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button type="button" onClick={swap} disabled={!output} className={secondaryButtonClass}>
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Swap
        </button>
        <label className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <input type="checkbox" checked={component} onChange={(event) => setComponent(event.target.checked)} className="accent-accent" />
          Component mode (encode reserved chars like &amp; and =)
        </label>
      </div>

      <div>
        <label className={labelClass}>{mode === "encode" ? "Text or URL" : "Encoded string"}</label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={mode === "encode" ? "https://example.com/search?q=hello world" : "https%3A%2F%2Fexample.com"}
          spellCheck={false}
          className={`${textareaClass} h-32`}
        />
        {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className={labelClass}>Output</label>
          <CopyButton value={output} />
        </div>
        <input readOnly value={output} placeholder="Output will appear here..." className={`${inputClass} font-mono`} />
      </div>
    </div>
  );
}
