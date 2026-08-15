"use client";

import { CopyButton } from "@/components/copy-button";
import { CRON_PRESETS, describeCron } from "@/lib/cron";
import { inputClass, labelClass, secondaryButtonClass } from "@/lib/utils";
import { useMemo, useState } from "react";

const FIELDS = [
  { key: "minute", label: "Minute", placeholder: "0-59" },
  { key: "hour", label: "Hour", placeholder: "0-23" },
  { key: "dayOfMonth", label: "Day (month)", placeholder: "1-31" },
  { key: "month", label: "Month", placeholder: "1-12" },
  { key: "dayOfWeek", label: "Day (week)", placeholder: "0-6" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

export function CronGeneratorTool() {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    minute: "0",
    hour: "2",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  });

  const expression = `${values.minute} ${values.hour} ${values.dayOfMonth} ${values.month} ${values.dayOfWeek}`;
  const description = useMemo(() => describeCron(expression), [expression]);

  function setField(key: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value || "*" }));
  }

  function applyPreset(exp: string) {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = exp.split(" ");
    setValues({ minute, hour, dayOfMonth, month, dayOfWeek });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {CRON_PRESETS.map((preset) => (
          <button key={preset.label} type="button" onClick={() => applyPreset(preset.expression)} className={secondaryButtonClass}>
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className={labelClass}>{field.label}</label>
            <input
              value={values[field.key]}
              onChange={(event) => setField(field.key, event.target.value)}
              placeholder={field.placeholder}
              spellCheck={false}
              className={`${inputClass} text-center font-mono`}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-4">
          <code className="rounded-md bg-background-subtle px-3 py-1.5 font-mono text-base text-accent">{expression}</code>
          <CopyButton value={expression} />
        </div>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>

      <div className="rounded-xl border border-border bg-background-subtle p-4 text-xs text-foreground-subtle">
        <p className="font-medium text-foreground-muted">Field reference</p>
        <p className="mt-1">
          minute (0-59) · hour (0-23) · day-of-month (1-31) · month (1-12) · day-of-week (0-6, Sunday = 0). Use{" "}
          <code>*</code> for &ldquo;any&rdquo;, <code>*/N</code> for step values, and commas or ranges for lists.
        </p>
      </div>
    </div>
  );
}
