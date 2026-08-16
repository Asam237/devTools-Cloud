import type { ToolDefinition } from "@/lib/tools-registry";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

/** Denser than ToolCard — icon + name only, for listing everything without repeating the same description grid. */
export function ToolRow({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;
  return (
    <Link
      href={`/devtools/${tool.slug}`}
      className="group flex items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5 transition-colors hover:border-foreground-subtle hover:bg-surface-hover"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background-subtle transition-colors group-hover:border-accent/40 group-hover:bg-accent-soft">
        <Icon className="h-3.5 w-3.5 text-accent" />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{tool.name}</span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
