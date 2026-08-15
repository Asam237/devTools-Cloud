import { DashboardCta } from "@/components/dashboard-cta";
import { DonateMethodCard } from "@/components/donate-method-card";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { ToolsExplorer } from "@/components/tools-explorer";
import { DONATE_METHODS } from "@/lib/donate";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { listPublicSnippetsAdmin } from "@/lib/firebase/admin-snippets";
import { TOOLS } from "@/lib/tools-registry";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/utils";
import { Clock, Download, FolderKanban, Heart, Plus, Puzzle, SquareCode } from "lucide-react";
import Link from "next/link";

const DASHBOARD_BENEFITS = [
  { icon: Clock, title: "History, everywhere", text: "Every tool you use is saved automatically and follows you across devices." },
  { icon: FolderKanban, title: "Projects & collections", text: "Organize API requests, collections, and environments by project." },
  { icon: SquareCode, title: "Snippets & sharing", text: "Save reusable code, tag it, and share it with the world when you're ready." },
];

const EXTENSION_TOOLS = ["JSON Formatter", "JWT Decoder", "Base64", "URL Encoder", "UUID Generator", "Hash Generator"];

const EXTENSION_STEPS = [
  "Download the .zip and unzip it anywhere on your machine.",
  "Open chrome://extensions (or edge://extensions) and turn on Developer mode.",
  "Click \"Load unpacked\" and select the unzipped folder.",
];

export default async function Home() {
  const communitySnippets = isFirebaseAdminConfigured ? await listPublicSnippetsAdmin({ limit: 6 }) : [];

  return (
    <>
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
        <p className="mb-4 text-sm font-medium text-accent">{TOOLS.length} tools, always free</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          One toolbox for
          <br />
          every developer
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-foreground-muted sm:text-lg">
          Format JSON, decode JWTs, test regex, generate UUIDs, and more — processed entirely in your
          browser. Nothing you paste ever reaches a server. No sign-up required.
        </p>
      </section>

      <ToolsExplorer />

      <section className="border-t border-border py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-accent">
              <Puzzle className="h-4 w-4" />
              Browser extension
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">The tools, one click away</h2>
            <p className="mt-3 max-w-lg text-foreground-muted">
              {EXTENSION_TOOLS.join(", ")} — right in your toolbar, no tab switch needed. Same client-side
              guarantee as the site: nothing you type ever leaves your browser.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="/downloads/devtools-cloud-extension-v0.1.0.zip" download className={primaryButtonClass}>
                <Download className="h-3.5 w-3.5" />
                Download for Chrome / Edge
              </a>
              <Link href="/extension" className={secondaryButtonClass}>
                Install instructions
              </Link>
            </div>
            <p className="mt-3 text-xs text-foreground-subtle">
              Not on the Chrome Web Store yet — this installs it manually in a few seconds. Fully open source.
            </p>
          </div>

          <ol className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
            {EXTENSION_STEPS.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm text-foreground-muted">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-medium text-accent">Community</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">Snippets, shared by developers</h2>
              <p className="mt-3 max-w-xl text-foreground-muted">
                Public code shared by people using DevTools Cloud — search it, copy it, or publish your own in seconds.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link href="/snippets" className="text-sm font-medium text-accent hover:underline">
                Browse all →
              </Link>
              <Link
                href="/dashboard/snippets"
                className={`${primaryButtonClass}`}
              >
                <Plus className="h-3.5 w-3.5" />
                Share a snippet
              </Link>
            </div>
          </div>

          {communitySnippets.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {communitySnippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-foreground-subtle">
              No public snippets yet — be the first to share one.
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="mb-3 text-sm font-medium text-accent">Your account</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">One sign-in, everything saved</h2>
            <p className="mt-3 text-foreground-muted">
              Still free, still no paywall — signing in just means DevTools Cloud remembers your work.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {DASHBOARD_BENEFITS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-border bg-surface p-5">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background-subtle">
                  <Icon className="h-4 w-4 text-accent" />
                </span>
                <h3 className="mb-1.5 text-sm font-medium text-foreground">{title}</h3>
                <p className="text-sm text-foreground-muted">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <DashboardCta className={primaryButtonClass}>Go to dashboard →</DashboardCta>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 border-t border-border bg-background-subtle py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-accent">
            <Heart className="h-4 w-4" />
            No paywall, ever
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Every tool, free forever.</h2>
          <p className="mx-auto mt-3 max-w-lg text-foreground-muted">
            No account required, no tiers. If DevTools Cloud saved you time, support it directly — Buy Me a
            Coffee or crypto.
          </p>

          <div className="mx-auto mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {DONATE_METHODS.map((method) => (
              <DonateMethodCard key={method.id} method={method} />
            ))}
          </div>

          <Link href="/pricing" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">
            More ways to support →
          </Link>
        </div>
      </section>
    </>
  );
}
