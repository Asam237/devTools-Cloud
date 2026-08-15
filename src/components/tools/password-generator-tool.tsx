"use client";

import { CopyButton } from "@/components/copy-button";
import { describeStrength, estimateEntropyBits, generatePassword, type PasswordOptions } from "@/lib/password";
import { primaryButtonClass } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

const CHARSET_TOGGLES: { key: keyof Omit<PasswordOptions, "length">; label: string }[] = [
  { key: "uppercase", label: "Uppercase (A-Z)" },
  { key: "lowercase", label: "Lowercase (a-z)" },
  { key: "numbers", label: "Numbers (0-9)" },
  { key: "symbols", label: "Symbols (!@#$...)" },
];

const STRENGTH_COLOR: Record<ReturnType<typeof describeStrength>, string> = {
  Weak: "text-danger",
  Fair: "text-warning",
  Strong: "text-success",
  "Very strong": "text-success",
};

export function PasswordGeneratorTool() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");

  function regenerate(next: PasswordOptions = options) {
    setPassword(generatePassword(next));
  }

  useEffect(() => {
    // Passwords must be generated on the client only: baking a value into the
    // server-rendered HTML would mismatch on hydration and defeat the purpose
    // of using crypto.getRandomValues.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- generate once on mount, then only via explicit option changes below
  }, []);

  function updateOptions(patch: Partial<PasswordOptions>) {
    const next = { ...options, ...patch };
    const anyCharsetLeft = next.uppercase || next.lowercase || next.numbers || next.symbols;
    if (!anyCharsetLeft) return;
    setOptions(next);
    regenerate(next);
  }

  const bits = estimateEntropyBits(options);
  const strength = describeStrength(bits);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-4">
        <span className="min-w-0 flex-1 truncate font-mono text-lg text-foreground">{password}</span>
        <CopyButton value={password} className="shrink-0" />
        <button type="button" onClick={() => regenerate()} className={`${primaryButtonClass} shrink-0`}>
          <RefreshCw className="h-3.5 w-3.5" />
          Regenerate
        </button>
      </div>

      <p className="text-xs text-foreground-subtle">
        Strength: <span className={STRENGTH_COLOR[strength]}>{strength}</span> · ~{bits} bits of entropy
      </p>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-foreground-subtle">Length</label>
            <span className="text-sm text-foreground-muted">{options.length}</span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={options.length}
            onChange={(event) => updateOptions({ length: Number(event.target.value) })}
            className="w-full accent-accent"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CHARSET_TOGGLES.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm text-foreground-muted">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(event) => updateOptions({ [key]: event.target.checked })}
                className="accent-accent"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
