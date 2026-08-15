"use client";

import { CopyButton } from "@/components/copy-button";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { labelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";
import { useMemo, useState } from "react";

function encode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decode(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

export function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useRestorableInput("base64-encoder", "");

  useHistoryDataRecorder("base64-encoder", input);

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      return { output: mode === "encode" ? encode(input) : decode(input), error: null };
    } catch {
      return { output: "", error: "Invalid Base64 input." };
    }
  }, [input, mode]);

  function swap() {
    setMode((prev) => (prev === "encode" ? "decode" : "encode"));
    setInput(output);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
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
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>{mode === "encode" ? "Plain text" : "Base64"}</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode === "encode" ? "Text to encode..." : "Base64 string to decode..."}
            spellCheck={false}
            className={`${textareaClass} h-64`}
          />
          {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>{mode === "encode" ? "Base64" : "Plain text"}</label>
            <CopyButton value={output} />
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Output will appear here..."
            className={`${textareaClass} h-64`}
          />
        </div>
      </div>
    </div>
  );
}
