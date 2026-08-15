"use client";

import { CopyButton } from "@/components/copy-button";
import { downloadTextFile } from "@/lib/utils";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/utils";
import { Download, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4, v7 as uuidv7 } from "uuid";

type Version = "v4" | "v7";

function generate(version: Version, count: number): string[] {
  const fn = version === "v4" ? uuidv4 : uuidv7;
  return Array.from({ length: count }, () => fn());
}

export function UuidGeneratorTool() {
  const [version, setVersion] = useState<Version>("v4");
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);

  useEffect(() => {
    // Random UUIDs must be generated on the client only: generating them during
    // server rendering would bake fixed values into the static HTML and mismatch
    // on hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUuids(generate("v4", 5));
  }, []);

  function regenerate() {
    setUuids(generate(version, count));
  }

  function format(value: string) {
    const withoutHyphens = hyphens ? value : value.replace(/-/g, "");
    return uppercase ? withoutHyphens.toUpperCase() : withoutHyphens;
  }

  const formatted = uuids.map(format);
  const allText = formatted.join("\n");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-surface p-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground-subtle">
            Version
          </label>
          <div className="flex overflow-hidden rounded-md border border-border">
            {(["v4", "v7"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVersion(v)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  version === v ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground-muted hover:bg-surface-hover"
                }`}
              >
                UUID {v}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground-subtle">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(event) => setCount(Math.min(1000, Math.max(1, Number(event.target.value) || 1)))}
            className="w-24 rounded-md border border-border bg-background-subtle px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-1.5 pb-2 text-sm text-foreground-muted">
          <input type="checkbox" checked={hyphens} onChange={(event) => setHyphens(event.target.checked)} className="accent-accent" />
          Hyphens
        </label>
        <label className="flex items-center gap-1.5 pb-2 text-sm text-foreground-muted">
          <input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)} className="accent-accent" />
          Uppercase
        </label>

        <button type="button" onClick={regenerate} className={`${primaryButtonClass} ml-auto`}>
          <RefreshCw className="h-3.5 w-3.5" />
          Generate
        </button>
      </div>

      <div className="flex items-center justify-end gap-2">
        <CopyButton value={allText} label="Copy all" />
        <button
          type="button"
          onClick={() => downloadTextFile("uuids.txt", allText)}
          disabled={!allText}
          className={secondaryButtonClass}
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
      </div>

      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {formatted.map((uuid, index) => (
          <div key={`${uuid}-${index}`} className="group flex items-center justify-between gap-3 px-4 py-2.5">
            <span className="select-all font-mono text-sm text-foreground">{uuid}</span>
            <CopyButton
              value={uuid}
              label=""
              className="border-none bg-transparent px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
