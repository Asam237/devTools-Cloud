"use client";

import { CopyButton } from "@/components/copy-button";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { downloadTextFile, labelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { ArrowLeftRight, Download } from "lucide-react";
import { useMemo, useState } from "react";

const SAMPLE_XML = `<user id="1">\n  <name>Ada Lovelace</name>\n  <active>true</active>\n</user>\n`;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function elementToObject(el: Element): unknown {
  const obj: Record<string, unknown> = {};
  for (const attr of Array.from(el.attributes)) {
    obj[`@${attr.name}`] = attr.value;
  }

  const children = Array.from(el.children);
  if (children.length === 0) {
    const text = el.textContent?.trim() ?? "";
    if (Object.keys(obj).length === 0) return text;
    if (text) obj["#text"] = text;
    return obj;
  }

  for (const child of children) {
    const value = elementToObject(child);
    const existing = obj[child.tagName];
    if (existing !== undefined) {
      if (Array.isArray(existing)) existing.push(value);
      else obj[child.tagName] = [existing, value];
    } else {
      obj[child.tagName] = value;
    }
  }
  return obj;
}

function xmlToJson(xmlString: string): string {
  const doc = new DOMParser().parseFromString(xmlString, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) throw new Error("Invalid XML — check that every tag is closed and properly nested.");
  const root = { [doc.documentElement.tagName]: elementToObject(doc.documentElement) };
  return JSON.stringify(root, null, 2);
}

function buildXmlElement(tag: string, value: unknown, indent: string): string {
  if (Array.isArray(value)) {
    return value.map((item) => buildXmlElement(tag, item, indent)).join("\n");
  }
  if (value !== null && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const attrs = Object.entries(obj)
      .filter(([key]) => key.startsWith("@"))
      .map(([key, v]) => ` ${key.slice(1)}="${escapeXml(String(v))}"`)
      .join("");
    const childEntries = Object.entries(obj).filter(([key]) => key !== "#text" && !key.startsWith("@"));
    if (childEntries.length === 0) {
      const inner = obj["#text"] !== undefined ? escapeXml(String(obj["#text"])) : "";
      return `${indent}<${tag}${attrs}>${inner}</${tag}>`;
    }
    const children = childEntries.map(([key, v]) => buildXmlElement(key, v, `${indent}  `)).join("\n");
    return `${indent}<${tag}${attrs}>\n${children}\n${indent}</${tag}>`;
  }
  return `${indent}<${tag}>${escapeXml(String(value))}</${tag}>`;
}

function jsonToXml(jsonString: string): string {
  const parsed = JSON.parse(jsonString);
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JSON must be an object with a single root key to convert to XML.");
  }
  const keys = Object.keys(parsed);
  if (keys.length !== 1) {
    throw new Error("JSON must have exactly one root key to convert to XML.");
  }
  const [rootKey] = keys;
  return `<?xml version="1.0" encoding="UTF-8"?>\n${buildXmlElement(rootKey, parsed[rootKey], "")}`;
}

export function XmlJsonConverterTool() {
  const [mode, setMode] = useState<"xml-to-json" | "json-to-xml">("xml-to-json");
  const [input, setInput] = useRestorableInput("xml-json-converter", "");

  useHistoryDataRecorder("xml-json-converter", input);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      return {
        output: mode === "xml-to-json" ? xmlToJson(input) : jsonToXml(input),
        error: null as string | null,
      };
    } catch (err) {
      return { output: "", error: err instanceof Error ? err.message : "Invalid input" };
    }
  }, [input, mode]);

  function swap() {
    setMode((prev) => (prev === "xml-to-json" ? "json-to-xml" : "xml-to-json"));
    setInput(output);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-md border border-border">
          <button
            type="button"
            onClick={() => setMode("xml-to-json")}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "xml-to-json" ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground-muted hover:bg-surface-hover"
            }`}
          >
            XML → JSON
          </button>
          <button
            type="button"
            onClick={() => setMode("json-to-xml")}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "json-to-xml" ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground-muted hover:bg-surface-hover"
            }`}
          >
            JSON → XML
          </button>
        </div>
        <button type="button" onClick={swap} disabled={!output} className={secondaryButtonClass}>
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Swap
        </button>
        <button type="button" onClick={() => setInput(SAMPLE_XML)} className={secondaryButtonClass}>
          Load sample
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>{mode === "xml-to-json" ? "XML" : "JSON"}</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode === "xml-to-json" ? "<user><name>Ada</name></user>" : '{\n  "user": { "name": "Ada" }\n}'}
            spellCheck={false}
            className={`${textareaClass} h-80`}
          />
          {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>{mode === "xml-to-json" ? "JSON" : "XML"}</label>
            <div className="flex items-center gap-2">
              <CopyButton value={output} />
              <button
                type="button"
                disabled={!output}
                onClick={() =>
                  downloadTextFile(
                    mode === "xml-to-json" ? "converted.json" : "converted.xml",
                    output,
                    mode === "xml-to-json" ? "application/json" : "application/xml"
                  )
                }
                className={secondaryButtonClass}
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Output will appear here..."
            className={`${textareaClass} h-80`}
          />
        </div>
      </div>
    </div>
  );
}
