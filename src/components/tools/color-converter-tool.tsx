"use client";

import { CopyButton } from "@/components/copy-button";
import {
  formatHsl,
  formatOklch,
  formatRgb,
  parseColor,
  rgbToHex,
  rgbToHsl,
  rgbToOklch,
} from "@/lib/color-convert";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { inputClass, labelClass } from "@/lib/utils";
import { useMemo } from "react";

export function ColorConverterTool() {
  const [input, setInput] = useRestorableInput("color-converter", "#7c3aed");

  useHistoryDataRecorder("color-converter", input);

  const rgb = useMemo(() => parseColor(input), [input]);

  const formats = useMemo(() => {
    if (!rgb) return null;
    return {
      hex: rgbToHex(rgb),
      rgb: formatRgb(rgb),
      hsl: formatHsl(rgbToHsl(rgb)),
      oklch: formatOklch(rgbToOklch(rgb)),
    };
  }, [rgb]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <label className={labelClass}>Color (hex, rgb(), or hsl())</label>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="#7c3aed"
            spellCheck={false}
            className={`${inputClass} font-mono`}
          />
        </div>
        <input
          type="color"
          value={formats?.hex ?? "#000000"}
          onChange={(event) => setInput(event.target.value)}
          aria-label="Pick a color"
          className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-border bg-surface p-1"
        />
      </div>

      {!rgb ? (
        <p className="text-xs text-danger">Couldn&apos;t parse that as a color — try a hex, rgb(), or hsl() value.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          <div
            className="h-20 w-full"
            style={{ backgroundColor: formats!.hex }}
            role="img"
            aria-label={`Color preview: ${formats!.hex}`}
          />
          {(
            [
              ["HEX", formats!.hex],
              ["RGB", formats!.rgb],
              ["HSL", formats!.hsl],
              ["OKLCH", formats!.oklch],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-subtle">{label}</p>
                <p className="truncate font-mono text-sm text-foreground">{value}</p>
              </div>
              <CopyButton value={value} className="shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
