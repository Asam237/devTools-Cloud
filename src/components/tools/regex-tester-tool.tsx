"use client";

import { CopyButton } from "@/components/copy-button";
import { REGEX_EXAMPLES, explainRegex } from "@/lib/regex-explain";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableJson } from "@/lib/use-restorable-input";
import { inputClass, labelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Fragment, useCallback, useMemo, useState } from "react";

const FLAG_OPTIONS = [
  { flag: "g", label: "Global" },
  { flag: "i", label: "Case insensitive" },
  { flag: "m", label: "Multiline" },
  { flag: "s", label: "Dot all" },
];

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");

  useRestorableJson<{ pattern: string; flags: string; testString: string }>(
    "regex-tester",
    useCallback((value) => {
      setPattern(value.pattern ?? "");
      setFlags(value.flags ?? "g");
      setTestString(value.testString ?? "");
    }, [])
  );
  useHistoryDataRecorder("regex-tester", pattern.trim() ? JSON.stringify({ pattern, flags, testString }) : "");

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null as RegExp | null, error: null as string | null };
    try {
      return { regex: new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`), error: null };
    } catch (err) {
      return { regex: null, error: err instanceof Error ? err.message : "Invalid regular expression" };
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!regex || !testString) return [];
    const found: RegExpExecArray[] = [];
    const re = new RegExp(regex.source, regex.flags);
    let match: RegExpExecArray | null;
    let guard = 0;
    while ((match = re.exec(testString)) !== null && guard < 1000) {
      found.push(match);
      guard += 1;
      if (match[0] === "") re.lastIndex += 1;
    }
    return found;
  }, [regex, testString]);

  const segments = useMemo(() => {
    if (matches.length === 0) return [{ text: testString, isMatch: false }];
    const parts: Array<{ text: string; isMatch: boolean }> = [];
    let cursor = 0;
    for (const match of matches) {
      if (match.index > cursor) parts.push({ text: testString.slice(cursor, match.index), isMatch: false });
      parts.push({ text: match[0] || "", isMatch: true });
      cursor = match.index + (match[0]?.length || 0);
    }
    if (cursor < testString.length) parts.push({ text: testString.slice(cursor), isMatch: false });
    return parts;
  }, [matches, testString]);

  const explanations = useMemo(() => (pattern ? explainRegex(pattern) : []), [pattern]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Regular expression</label>
        <div className="flex items-center gap-2">
          <span className="text-lg text-foreground-subtle">/</span>
          <input
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder="[a-z]+"
            spellCheck={false}
            className={`${inputClass} font-mono`}
          />
          <span className="text-lg text-foreground-subtle">/{flags}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {FLAG_OPTIONS.map((option) => (
            <label key={option.flag} className="flex items-center gap-1.5 text-xs text-foreground-muted">
              <input
                type="checkbox"
                checked={flags.includes(option.flag)}
                onChange={(event) => {
                  setFlags((prev) =>
                    event.target.checked ? prev + option.flag : prev.replace(option.flag, "")
                  );
                }}
                className="accent-accent"
              />
              {option.label} ({option.flag})
            </label>
          ))}
        </div>
      </div>

      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-danger">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {REGEX_EXAMPLES.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => {
              setPattern(example.pattern);
              setFlags(example.flags || "g");
            }}
            className={secondaryButtonClass}
          >
            {example.label}
          </button>
        ))}
      </div>

      <div>
        <label className={labelClass}>Test string</label>
        <textarea
          value={testString}
          onChange={(event) => setTestString(event.target.value)}
          placeholder="Paste text to test your regex against..."
          spellCheck={false}
          className={`${textareaClass} h-40`}
        />
      </div>

      <div>
        <label className={labelClass}>
          Highlighted matches {matches.length > 0 ? `(${matches.length})` : ""}
        </label>
        <div className="min-h-24 whitespace-pre-wrap rounded-lg border border-border bg-background-subtle px-3.5 py-3 font-mono text-sm text-foreground">
          {testString ? (
            segments.map((segment, index) => (
              <Fragment key={index}>
                {segment.isMatch ? (
                  <mark className="rounded bg-accent/25 text-foreground">{segment.text}</mark>
                ) : (
                  segment.text
                )}
              </Fragment>
            ))
          ) : (
            <span className="text-foreground-subtle">Matches will be highlighted here.</span>
          )}
        </div>
      </div>

      {matches.length > 0 ? (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-foreground-subtle">Capture groups</label>
            <CopyButton value={matches.map((match) => match[0]).join("\n")} label="Copy matches" />
          </div>
          <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {matches.map((match, index) => (
              <div key={index} className="px-4 py-2.5 font-mono text-xs">
                <span className="text-foreground-subtle">Match {index + 1}: </span>
                <span className="text-foreground">{match[0]}</span>
                {match.length > 1 ? (
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-foreground-muted">
                    {match.slice(1).map((group, groupIndex) => (
                      <span key={groupIndex}>
                        Group {groupIndex + 1}: <span className="text-foreground">{group ?? "—"}</span>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {explanations.length > 0 ? (
        <div>
          <label className={labelClass}>Basic explanation</label>
          <ul className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-4 text-sm text-foreground-muted">
            {explanations.map((explanation, index) => (
              <li key={index} className="font-mono text-xs">
                {explanation}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
