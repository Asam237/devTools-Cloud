export type DiffStatus = "added" | "removed" | "changed" | "unchanged";

export type DiffLine = {
  path: string;
  status: DiffStatus;
  before?: unknown;
  after?: unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringify(value: unknown): string {
  if (value === undefined) return "undefined";
  if (typeof value === "string") return JSON.stringify(value);
  if (isPlainObject(value) || Array.isArray(value)) return JSON.stringify(value);
  return String(value);
}

function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function diffJson(left: unknown, right: unknown, path = "$"): DiffLine[] {
  const lines: DiffLine[] = [];

  const leftIsContainer = isPlainObject(left) || Array.isArray(left);
  const rightIsContainer = isPlainObject(right) || Array.isArray(right);

  if (leftIsContainer && rightIsContainer && Array.isArray(left) === Array.isArray(right)) {
    if (Array.isArray(left) && Array.isArray(right)) {
      const maxLength = Math.max(left.length, right.length);
      for (let i = 0; i < maxLength; i += 1) {
        const childPath = `${path}[${i}]`;
        if (i >= left.length) {
          lines.push({ path: childPath, status: "added", after: right[i] });
        } else if (i >= right.length) {
          lines.push({ path: childPath, status: "removed", before: left[i] });
        } else {
          lines.push(...diffJson(left[i], right[i], childPath));
        }
      }
    } else {
      const leftObj = left as Record<string, unknown>;
      const rightObj = right as Record<string, unknown>;
      const keys = Array.from(new Set([...Object.keys(leftObj), ...Object.keys(rightObj)])).sort();
      for (const key of keys) {
        const childPath = `${path}.${key}`;
        const hasLeft = Object.prototype.hasOwnProperty.call(leftObj, key);
        const hasRight = Object.prototype.hasOwnProperty.call(rightObj, key);
        if (!hasLeft) {
          lines.push({ path: childPath, status: "added", after: rightObj[key] });
        } else if (!hasRight) {
          lines.push({ path: childPath, status: "removed", before: leftObj[key] });
        } else {
          lines.push(...diffJson(leftObj[key], rightObj[key], childPath));
        }
      }
    }
    return lines;
  }

  if (isEqual(left, right)) {
    lines.push({ path, status: "unchanged", before: left, after: right });
  } else {
    lines.push({ path, status: "changed", before: left, after: right });
  }
  return lines;
}

export { stringify as diffValueToString };
