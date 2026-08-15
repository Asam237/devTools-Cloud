"use client";

import { CopyButton } from "@/components/copy-button";
import { HASH_ALGORITHMS, computeAllHashes, type HashAlgorithm } from "@/lib/hash";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { labelClass, textareaClass } from "@/lib/utils";
import { useEffect, useState } from "react";

export function HashGeneratorTool() {
  const [input, setInput] = useRestorableInput("hash-generator", "");
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string> | null>(null);

  useHistoryDataRecorder("hash-generator", input);

  useEffect(() => {
    if (!input) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing derived state when the input is emptied, not synchronizing with an external system
      setHashes(null);
      return;
    }
    let cancelled = false;
    computeAllHashes(input).then((result) => {
      if (!cancelled) setHashes(result);
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Text</label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type or paste text to hash..."
          spellCheck={false}
          className={`${textareaClass} h-32`}
        />
      </div>

      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {HASH_ALGORITHMS.map((algorithm) => (
          <div key={algorithm} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground-subtle">{algorithm}</p>
              <p className="truncate font-mono text-sm text-foreground">{hashes?.[algorithm] ?? "—"}</p>
            </div>
            <CopyButton value={hashes?.[algorithm] ?? ""} className="shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
