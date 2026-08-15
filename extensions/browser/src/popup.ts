import { decodeJwt, getTimeClaims } from "../../../src/lib/jwt";
import { computeAllHashes, HASH_ALGORITHMS } from "../../../src/lib/hash";
import { formatJson, minifyJson } from "./tools/json-formatter";
import { encodeBase64, decodeBase64 } from "./tools/base64";
import { encodeUrl, decodeUrl } from "./tools/url-encoder";
import { generateUuid } from "./tools/uuid";

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el as T;
}

function showError(el: HTMLElement, message: string | null) {
  if (message) {
    el.textContent = message;
    el.hidden = false;
  } else {
    el.hidden = true;
  }
}

async function copyToClipboard(text: string, trigger: HTMLElement) {
  await navigator.clipboard.writeText(text);
  const original = trigger.textContent;
  trigger.textContent = "Copied!";
  setTimeout(() => {
    trigger.textContent = original;
  }, 1200);
}

// --- Tabs ---
function initTabs() {
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>(".tab"));
  const panels = Array.from(document.querySelectorAll<HTMLElement>(".panel"));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tool;
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      panels.forEach((p) => {
        p.hidden = p.dataset.panel !== target;
      });
    });
  });
}

// --- JSON Formatter ---
function initJson() {
  const input = byId<HTMLTextAreaElement>("json-input");
  const output = byId<HTMLElement>("json-output");
  const error = byId<HTMLElement>("json-error");

  const run = (fn: (value: string) => string) => {
    try {
      output.textContent = fn(input.value);
      showError(error, null);
    } catch (err) {
      showError(error, err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  byId("json-format").addEventListener("click", () => run((v) => formatJson(v)));
  byId("json-minify").addEventListener("click", () => run((v) => minifyJson(v)));
}

// --- JWT Decoder ---
function initJwt() {
  const input = byId<HTMLTextAreaElement>("jwt-input");
  const error = byId<HTMLElement>("jwt-error");
  const header = byId<HTMLElement>("jwt-header");
  const payload = byId<HTMLElement>("jwt-payload");
  const claims = byId<HTMLElement>("jwt-claims");

  input.addEventListener("input", () => {
    if (!input.value.trim()) {
      header.textContent = "";
      payload.textContent = "";
      claims.innerHTML = "";
      showError(error, null);
      return;
    }
    try {
      const decoded = decodeJwt(input.value);
      header.textContent = JSON.stringify(decoded.header, null, 2);
      payload.textContent = JSON.stringify(decoded.payload, null, 2);
      claims.innerHTML = "";
      for (const { claim, date } of getTimeClaims(decoded.payload)) {
        const row = document.createElement("div");
        row.className = "claim";
        row.innerHTML = `<span class="claim-name">${claim}</span><span>${date.toLocaleString()}</span>`;
        claims.appendChild(row);
      }
      showError(error, null);
    } catch (err) {
      showError(error, err instanceof Error ? err.message : "Invalid token");
      header.textContent = "";
      payload.textContent = "";
      claims.innerHTML = "";
    }
  });
}

// --- Base64 ---
function initBase64() {
  const input = byId<HTMLTextAreaElement>("base64-input");
  const output = byId<HTMLElement>("base64-output");
  const error = byId<HTMLElement>("base64-error");

  const run = (fn: (value: string) => string) => {
    try {
      output.textContent = fn(input.value);
      showError(error, null);
    } catch {
      showError(error, "Invalid input for this operation");
    }
  };

  byId("base64-encode").addEventListener("click", () => run(encodeBase64));
  byId("base64-decode").addEventListener("click", () => run(decodeBase64));
}

// --- URL Encoder ---
function initUrl() {
  const input = byId<HTMLTextAreaElement>("url-input");
  const output = byId<HTMLElement>("url-output");
  const error = byId<HTMLElement>("url-error");

  const run = (fn: (value: string) => string) => {
    try {
      output.textContent = fn(input.value);
      showError(error, null);
    } catch {
      showError(error, "Invalid input for this operation");
    }
  };

  byId("url-encode").addEventListener("click", () => run(encodeUrl));
  byId("url-decode").addEventListener("click", () => run(decodeUrl));
}

// --- Generic copy buttons (json/base64/url output blocks) ---
function initCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.copyTarget;
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target?.textContent) return;
      copyToClipboard(target.textContent, button);
    });
  });
}

// --- UUID Generator ---
function initUuid() {
  const list = byId<HTMLElement>("uuid-list");

  const addUuid = (version: "v4" | "v7") => {
    const value = generateUuid(version);
    const row = document.createElement("div");
    row.className = "uuid-row";
    row.innerHTML = `<span class="mono">${value}</span><button class="icon-btn">Copy</button>`;
    row.querySelector("button")?.addEventListener("click", (event) => {
      copyToClipboard(value, event.currentTarget as HTMLElement);
    });
    list.prepend(row);
    while (list.children.length > 8) {
      list.lastElementChild?.remove();
    }
  };

  byId("uuid-v4").addEventListener("click", () => addUuid("v4"));
  byId("uuid-v7").addEventListener("click", () => addUuid("v7"));
}

// --- Hash Generator ---
function initHash() {
  const input = byId<HTMLTextAreaElement>("hash-input");
  const list = byId<HTMLElement>("hash-list");

  const render = (hashes: Record<string, string> | null) => {
    list.innerHTML = "";
    for (const algorithm of HASH_ALGORITHMS) {
      const value = hashes?.[algorithm] ?? "—";
      const row = document.createElement("div");
      row.className = "hash-row";
      row.innerHTML = `<span class="hash-algo">${algorithm}</span><span class="mono">${value}</span><button class="icon-btn">Copy</button>`;
      row.querySelector("button")?.addEventListener("click", (event) => {
        if (hashes?.[algorithm]) copyToClipboard(hashes[algorithm], event.currentTarget as HTMLElement);
      });
      list.appendChild(row);
    }
  };

  render(null);

  let requestId = 0;
  input.addEventListener("input", async () => {
    const value = input.value;
    const currentRequest = ++requestId;
    if (!value) {
      render(null);
      return;
    }
    const hashes = await computeAllHashes(value);
    if (currentRequest === requestId) render(hashes);
  });
}

initTabs();
initJson();
initJwt();
initBase64();
initUrl();
initCopyButtons();
initUuid();
initHash();
