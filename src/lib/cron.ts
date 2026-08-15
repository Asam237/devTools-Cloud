const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function describeField(value: string, unit: string, names?: string[]): string | null {
  if (value === "*") return null;
  if (value.includes("/")) {
    const [, step] = value.split("/");
    return `every ${step} ${unit}${step === "1" ? "" : "s"}`;
  }
  if (value.includes(",")) {
    const parts = value.split(",").map((part) => (names ? names[Number(part)] ?? part : part));
    return `${unit} ${parts.join(", ")}`;
  }
  if (value.includes("-")) {
    const [start, end] = value.split("-");
    const startLabel = names ? names[Number(start)] ?? start : start;
    const endLabel = names ? names[Number(end)] ?? end : end;
    return `${unit} ${startLabel} through ${endLabel}`;
  }
  const label = names ? names[Number(value)] ?? value : value;
  return `${unit} ${label}`;
}

export function describeCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return "A cron expression needs exactly 5 fields: minute hour day-of-month month day-of-week.";

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  if (minute === "*" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return "Runs every minute.";
  }

  if (minute.includes("/") && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    const [, step] = minute.split("/");
    return `Runs every ${step} minutes.`;
  }

  const segments: string[] = [];

  if (minute !== "*" && hour !== "*" && !minute.includes("/") && !hour.includes("/") && !minute.includes(",") && !hour.includes(",")) {
    const h = Number(hour);
    const m = Number(minute);
    if (!Number.isNaN(h) && !Number.isNaN(m)) {
      segments.push(`at ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  } else {
    const minuteDesc = describeField(minute, "minute");
    const hourDesc = describeField(hour, "hour");
    if (minuteDesc) segments.push(minuteDesc);
    if (hourDesc) segments.push(hourDesc);
  }

  const domDesc = describeField(dayOfMonth, "on day-of-month");
  if (domDesc) segments.push(domDesc);

  const monthDesc = describeField(month, "in", MONTH_NAMES);
  if (monthDesc) segments.push(monthDesc);

  const dowDesc = describeField(dayOfWeek, "on", DAY_NAMES);
  if (dowDesc) segments.push(dowDesc);

  if (segments.length === 0) return "Runs every minute.";

  const prefix = dayOfMonth === "*" && dayOfWeek === "*" && month === "*" ? "Every day" : "Runs";
  return `${prefix} ${segments.join(", ")}.`.replace(/^Every day at/, "Every day at");
}

export const CRON_PRESETS = [
  { label: "Every minute", expression: "* * * * *" },
  { label: "Every 5 minutes", expression: "*/5 * * * *" },
  { label: "Every hour", expression: "0 * * * *" },
  { label: "Every day at 02:00", expression: "0 2 * * *" },
  { label: "Every Monday at 09:00", expression: "0 9 * * 1" },
  { label: "First day of month", expression: "0 0 1 * *" },
];
