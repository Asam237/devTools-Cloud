"use client";

import { CopyButton } from "@/components/copy-button";
import { consumeHistoryRestore } from "@/lib/history-restore";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { inputClass, labelClass, secondaryButtonClass } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateTimeLocal(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function TimestampConverterTool() {
  const [now, setNow] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState("");
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");

  useHistoryDataRecorder("timestamp-converter", timestamp);

  useEffect(() => {
    // The current time is inherently non-deterministic, so it can only be
    // established on the client after mount (matches the initial empty SSR state).
    // A reopened history entry takes priority over defaulting to "now" — checked
    // here, in the same effect, so there's no ordering race between the two.
    const current = Date.now();
    const restored = consumeHistoryRestore("timestamp-converter");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(current);
    setTimestamp(restored ?? String(Math.floor(current / 1000)));
  }, []);

  const parsedDate = useMemo(() => {
    const value = Number(timestamp);
    if (!timestamp.trim() || Number.isNaN(value)) return null;
    const ms = unit === "seconds" ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [timestamp, unit]);

  const dateInput = useMemo(() => (parsedDate ? toDateTimeLocal(parsedDate) : ""), [parsedDate]);

  function useCurrent() {
    const current = Date.now();
    setTimestamp(String(unit === "seconds" ? Math.floor(current / 1000) : current));
  }

  function convertFromDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return;
    setTimestamp(String(unit === "seconds" ? Math.floor(date.getTime() / 1000) : date.getTime()));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-surface p-5">
        <label className={labelClass}>Unix timestamp</label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={timestamp}
            onChange={(event) => setTimestamp(event.target.value.replace(/[^0-9-]/g, ""))}
            spellCheck={false}
            className={`${inputClass} max-w-xs font-mono`}
          />
          <div className="flex overflow-hidden rounded-md border border-border">
            {(["seconds", "milliseconds"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-3 py-2 text-xs transition-colors ${
                  unit === u ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground-muted hover:bg-surface-hover"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
          <button type="button" onClick={useCurrent} className={secondaryButtonClass}>
            Now
          </button>
        </div>
        {now !== null ? (
          <p className="mt-2 text-xs text-foreground-subtle">
            Current time: {Math.floor(now / 1000)} (s) · {now} (ms)
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <label className={labelClass}>Human-readable date</label>
        <input
          type="datetime-local"
          step={1}
          value={dateInput}
          onChange={(event) => convertFromDate(event.target.value)}
          className={`${inputClass} max-w-xs font-mono`}
        />
      </div>

      {parsedDate ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "ISO 8601", value: parsedDate.toISOString() },
            { label: "UTC", value: parsedDate.toUTCString() },
            { label: "Local", value: parsedDate.toString() },
            { label: "Relative", value: formatRelative(parsedDate) },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background-subtle px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs text-foreground-subtle">{row.label}</p>
                <p className="truncate font-mono text-sm text-foreground">{row.value}</p>
              </div>
              <CopyButton value={row.value} label="" className="px-2" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-danger">Enter a valid timestamp or date.</p>
      )}
    </div>
  );
}

function formatRelative(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const diffSeconds = Math.round(diffMs / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(diffSeconds) >= secondsInUnit || unit === "second") {
      return rtf.format(Math.round(diffSeconds / secondsInUnit), unit);
    }
  }
  return "now";
}
