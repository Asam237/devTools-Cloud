"use client";

import { CopyButton } from "@/components/copy-button";
import { diffJson, diffValueToString, type DiffLine } from "@/lib/json-diff";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableJson } from "@/lib/use-restorable-input";
import { labelClass, textareaClass } from "@/lib/utils";
import { Minus, Plus, RefreshCw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

function diffLineToText(line: DiffLine): string {
  switch (line.status) {
    case "added":
      return `${line.path}\n+ ${diffValueToString(line.after)}`;
    case "removed":
      return `${line.path}\n- ${diffValueToString(line.before)}`;
    case "changed":
      return `${line.path}\n- ${diffValueToString(line.before)}\n+ ${diffValueToString(line.after)}`;
    case "unchanged":
      return `${line.path}\n  ${diffValueToString(line.before)}`;
  }
}

const STATUS_STYLES: Record<DiffLine["status"], string> = {
  added: "border-l-2 border-success bg-success/5",
  removed: "border-l-2 border-danger bg-danger/5",
  changed: "border-l-2 border-warning bg-warning/5",
  unchanged: "border-l-2 border-transparent",
};

export function JsonDiffTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [showUnchanged, setShowUnchanged] = useState(false);

  useRestorableJson<{ left: string; right: string }>(
    "json-diff",
    useCallback((value) => {
      setLeft(value.left ?? "");
      setRight(value.right ?? "");
    }, [])
  );
  useHistoryDataRecorder("json-diff", left.trim() && right.trim() ? JSON.stringify({ left, right }) : "");

  const { lines, error } = useMemo(() => {
    if (!left.trim() || !right.trim()) return { lines: [] as DiffLine[], error: null as string | null };
    try {
      const leftParsed = JSON.parse(left);
      const rightParsed = JSON.parse(right);
      return { lines: diffJson(leftParsed, rightParsed), error: null };
    } catch (err) {
      return { lines: [], error: err instanceof Error ? err.message : "Invalid JSON" };
    }
  }, [left, right]);

  const visibleLines = showUnchanged ? lines : lines.filter((line) => line.status !== "unchanged");
  const stats = useMemo(() => {
    return lines.reduce(
      (acc, line) => {
        acc[line.status] += 1;
        return acc;
      },
      { added: 0, removed: 0, changed: 0, unchanged: 0 }
    );
  }, [lines]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>Original JSON</label>
          <textarea
            value={left}
            onChange={(event) => setLeft(event.target.value)}
            placeholder='{"name": "Ada"}'
            spellCheck={false}
            className={`${textareaClass} h-64`}
          />
        </div>
        <div>
          <label className={labelClass}>Modified JSON</label>
          <textarea
            value={right}
            onChange={(event) => setRight(event.target.value)}
            placeholder='{"name": "Grace"}'
            spellCheck={false}
            className={`${textareaClass} h-64`}
          />
        </div>
      </div>

      {error ? <p className="text-xs text-danger">{error}</p> : null}

      {lines.length > 0 ? (
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-foreground-muted">
            <span className="flex items-center gap-1">
              <Plus className="h-3 w-3 text-success" /> {stats.added} added
            </span>
            <span className="flex items-center gap-1">
              <Minus className="h-3 w-3 text-danger" /> {stats.removed} removed
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3 text-warning" /> {stats.changed} changed
            </span>
            <label className="ml-auto flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={showUnchanged}
                onChange={(event) => setShowUnchanged(event.target.checked)}
                className="accent-accent"
              />
              Show unchanged
            </label>
            <CopyButton value={visibleLines.map(diffLineToText).join("\n\n")} label="Copy diff" />
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            {visibleLines.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-foreground-subtle">No differences found.</p>
            ) : (
              visibleLines.map((line, index) => (
                <div
                  key={`${line.path}-${index}`}
                  className={`flex flex-col gap-1 bg-surface px-4 py-2.5 font-mono text-xs ${STATUS_STYLES[line.status]}`}
                >
                  <span className="text-foreground-subtle">{line.path}</span>
                  {line.status === "added" && (
                    <span className="text-success">+ {diffValueToString(line.after)}</span>
                  )}
                  {line.status === "removed" && (
                    <span className="text-danger">- {diffValueToString(line.before)}</span>
                  )}
                  {line.status === "changed" && (
                    <>
                      <span className="text-danger">- {diffValueToString(line.before)}</span>
                      <span className="text-success">+ {diffValueToString(line.after)}</span>
                    </>
                  )}
                  {line.status === "unchanged" && (
                    <span className="text-foreground-muted">{diffValueToString(line.before)}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
