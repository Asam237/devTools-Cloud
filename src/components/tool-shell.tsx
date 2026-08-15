import { ShareButtons } from "@/components/share-buttons";
import { SITE_URL } from "@/lib/site";
import type { ToolDefinition } from "@/lib/tools-registry";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function ToolShell({ tool, children }: { tool: ToolDefinition; children: ReactNode }) {
  const Icon = tool.icon;
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/#tools"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All tools
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
            <Icon className="h-5 w-5 text-accent" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{tool.name}</h1>
            <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{tool.shortDescription}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <span className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-foreground-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            Runs locally in your browser
          </span>
          <ShareButtons url={`${SITE_URL}/devtools/${tool.slug}`} title={tool.name} />
        </div>
      </div>

      {children}
    </div>
  );
}
