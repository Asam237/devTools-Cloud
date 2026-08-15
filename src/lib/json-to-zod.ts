function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidIdentifier(key: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

function formatKey(key: string): string {
  return isValidIdentifier(key) ? key : JSON.stringify(key);
}

function indent(text: string, spaces = 2): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line ? pad + line : line))
    .join("\n");
}

function inferZod(value: unknown): string {
  if (value === null) return "z.null()";
  if (Array.isArray(value)) {
    if (value.length === 0) return "z.array(z.unknown())";
    const elementSchemas = Array.from(new Set(value.map((item) => inferZod(item))));
    const element = elementSchemas.length === 1 ? elementSchemas[0] : `z.union([${elementSchemas.join(", ")}])`;
    return `z.array(${element})`;
  }
  if (isPlainObject(value)) {
    const entries = Object.entries(value).map(([key, val]) => {
      const schema = inferZod(val);
      return `${formatKey(key)}: ${schema},`;
    });
    if (entries.length === 0) return "z.object({})";
    return `z.object({\n${indent(entries.join("\n"))}\n})`;
  }
  switch (typeof value) {
    case "string":
      return "z.string()";
    case "number":
      return Number.isInteger(value) ? "z.number().int()" : "z.number()";
    case "boolean":
      return "z.boolean()";
    default:
      return "z.unknown()";
  }
}

export function jsonToZod(json: unknown, schemaName = "rootSchema"): string {
  const schema = inferZod(json);
  return `import { z } from "zod";\n\nconst ${schemaName} = ${schema};\n`;
}
