import { FaqAccordion } from "@/components/faq-accordion";
import { getToolBySlug } from "@/lib/tools-registry";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/utils";
import type { ToolFaq } from "@/lib/tool-seo";
import { Download } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Browser Extension — DevTools Cloud",
  description:
    "Install the DevTools Cloud browser extension: JSON Formatter, JWT Decoder, Base64, URL Encoder, UUID Generator, and Hash Generator in your toolbar. Free, open source, fully client-side.",
  alternates: { canonical: "/extension" },
};

const EXTENSION_TOOL_SLUGS = ["json-formatter", "jwt-decoder", "base64-encoder", "url-encoder", "uuid-generator", "hash-generator"];

const INSTALL_STEPS = [
  {
    title: "Download the extension",
    text: "Grab the .zip below and unzip it anywhere on your machine — no installer, no admin rights needed.",
  },
  {
    title: "Open your browser's extensions page",
    text: "Chrome: go to chrome://extensions. Edge: go to edge://extensions. Then turn on \"Developer mode\" (top right).",
  },
  {
    title: "Load it unpacked",
    text: "Click \"Load unpacked\" and select the folder you unzipped. The DevTools Cloud icon appears in your toolbar immediately.",
  },
];

const EXTENSION_FAQ: ToolFaq[] = [
  {
    question: "Why isn't this on the Chrome Web Store yet?",
    answer:
      "It's brand new — a Web Store listing is planned, but the manual install above works today and takes about 30 seconds. Since the extension is open source, you can also read every line of code before installing.",
  },
  {
    question: "Does it send my data anywhere?",
    answer:
      "No. The extension has no network permissions at all — it can't make requests even if it wanted to. Every tool runs the same client-side logic as devtools.cloud, entirely inside the popup.",
  },
  {
    question: "Will Firefox be supported?",
    answer: "The extension is built on the Manifest V3 standard, which Firefox also supports — a Firefox-specific build is on the roadmap.",
  },
  {
    question: "What about a VS Code extension?",
    answer: "In progress — same tool set, directly in the editor. It'll be linked here once it ships.",
  },
];

export default function ExtensionPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-medium text-accent">Browser extension</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Your favorite tools, in your toolbar
        </h1>
        <p className="mt-4 text-foreground-muted">
          JSON Formatter, JWT Decoder, Base64, URL Encoder, UUID Generator, and Hash Generator — one click away,
          no tab switch. Same guarantee as the site: nothing you paste or type ever leaves your browser.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/downloads/devtools-cloud-extension-v0.1.0.zip" download className={primaryButtonClass}>
            <Download className="h-3.5 w-3.5" />
            Download devtools-cloud-extension-v0.1.0.zip
          </a>
          <a
            href="https://github.com/Asam237/devTools-Cloud/tree/main/extensions/browser"
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryButtonClass}
          >
            View source
          </a>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="mb-5 text-lg font-medium text-foreground">Install in 3 steps</h2>
        <ol className="flex flex-col gap-4">
          {INSTALL_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-xl border border-border bg-surface p-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="mt-1 text-sm text-foreground-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-16">
        <h2 className="mb-5 text-lg font-medium text-foreground">Included tools</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {EXTENSION_TOOL_SLUGS.map((slug) => {
            const tool = getToolBySlug(slug);
            if (!tool) return null;
            return (
              <Link
                key={slug}
                href={`/devtools/${slug}`}
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground-subtle"
              >
                {tool.name}
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-lg font-medium text-foreground">Frequently asked questions</h2>
        <FaqAccordion items={EXTENSION_FAQ} />
      </section>
    </div>
  );
}
