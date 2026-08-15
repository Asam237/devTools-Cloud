import type { ToolDefinition } from "@/lib/tools-registry";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;
  return (
    <Link
      href={`/devtools/${tool.slug}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-foreground-subtle hover:shadow-lg hover:shadow-black/5"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background-subtle transition-colors group-hover:border-accent/40 group-hover:bg-accent-soft">
          <Icon className="h-5 w-5 text-accent" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div>
        <h3 className="font-medium text-foreground">{tool.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{tool.shortDescription}</p>
      </div>
    </Link>
  );
}
