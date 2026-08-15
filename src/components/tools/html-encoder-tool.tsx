"use client";

import { CopyButton } from "@/components/copy-button";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { labelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";
import { useMemo, useState } from "react";

function encode(value: string, encodeNonAscii: boolean): string {
  let result = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  if (encodeNonAscii) {
    result = Array.from(result)
      .map((char) => {
        const code = char.codePointAt(0) ?? 0;
        return code > 127 ? `&#${code};` : char;
      })
      .join("");
  }
  return result;
}

function decode(value: string): string {
  // Off-DOM textarea: browsers decode HTML entities in .innerHTML without
  // executing any script content, so this is safe for arbitrary user input.
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

export function HtmlEncoderTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeNonAscii, setEncodeNonAscii] = useState(false);
  const [input, setInput] = useRestorableInput("html-encoder", "");

  useHistoryDataRecorder("html-encoder", input);

  const output = useMemo(() => {
    if (!input) return "";
    return mode === "encode" ? encode(input, encodeNonAscii) : decode(input);
  }, [input, mode, encodeNonAscii]);

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
        {mode === "encode" ? (
          <label className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <input
              type="checkbox"
              checked={encodeNonAscii}
              onChange={(event) => setEncodeNonAscii(event.target.checked)}
              className="accent-accent"
            />
            Encode non-ASCII characters as numeric entities
          </label>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>{mode === "encode" ? "Plain text / HTML" : "Encoded HTML"}</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode === "encode" ? "<div class=\"card\">Hello & welcome</div>" : "&lt;div&gt;Hello &amp; welcome&lt;/div&gt;"}
            spellCheck={false}
            className={`${textareaClass} h-64`}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>{mode === "encode" ? "Encoded HTML" : "Decoded text"}</label>
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
