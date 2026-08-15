function toInterfaceName(key: string): string {
  const cleaned = key.replace(/[^a-zA-Z0-9]/g, " ");
  const parts = cleaned.split(" ").filter(Boolean);
  const pascal = parts.map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  return pascal || "Root";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidIdentifier(key: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

function formatKey(key: string): string {
  return isValidIdentifier(key) ? key : JSON.stringify(key);
}

type Interfaces = Map<string, string>;

function primitiveType(value: unknown): string {
  if (value === null) return "null";
  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "unknown";
  }
}

function inferType(value: unknown, name: string, interfaces: Interfaces): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const elementTypes = new Set(value.map((item) => inferType(item, name, interfaces)));
    if (elementTypes.size === 1) {
      const [only] = elementTypes;
      return only.includes(" ") ? `(${only})[]` : `${only}[]`;
    }
    return `(${Array.from(elementTypes).join(" | ")})[]`;
  }

  if (isPlainObject(value)) {
    const interfaceName = toInterfaceName(name);
    const body = buildInterfaceBody(value, name, interfaces);
    let finalName = interfaceName;
    let suffix = 2;
    while (interfaces.has(finalName) && interfaces.get(finalName) !== body) {
      finalName = `${interfaceName}${suffix}`;
      suffix += 1;
    }
    interfaces.set(finalName, body);
    return finalName;
  }

  return primitiveType(value);
}

function buildInterfaceBody(obj: Record<string, unknown>, parentName: string, interfaces: Interfaces): string {
  const lines = Object.entries(obj).map(([key, value]) => {
    const fieldType = inferType(value, key, interfaces);
    const optional = value === null ? "?" : "";
    return `  ${formatKey(key)}${optional}: ${fieldType};`;
  });
  return lines.join("\n");
}

export function jsonToTypeScript(json: unknown, rootName = "Root"): string {
  const interfaces: Interfaces = new Map();

  if (Array.isArray(json)) {
    const elementType = inferType(json[0] ?? {}, rootName, interfaces);
    const rendered = Array.from(interfaces.entries())
      .reverse()
      .map(([name, body]) => `interface ${name} {\n${body}\n}`)
      .join("\n\n");
    return `${rendered}\n\ntype ${rootName} = ${elementType}[];`.trim();
  }

  if (!isPlainObject(json)) {
    return `type ${rootName} = ${primitiveType(json)};`;
  }

  const body = buildInterfaceBody(json, rootName, interfaces);
  interfaces.set(rootName, body);

  return Array.from(interfaces.entries())
    .reverse()
    .map(([name, ifaceBody]) => `interface ${name} {\n${ifaceBody}\n}`)
    .join("\n\n");
}
