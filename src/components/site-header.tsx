import { AuthNav } from "@/components/auth-nav";
import { CommandPalette } from "@/components/command-palette";
import { HeaderDashboardLink } from "@/components/header-dashboard-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Heart, Terminal } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Terminal className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">DevTools Cloud</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-foreground-muted md:flex">
          <Link href="/#tools" className="rounded-md px-3 py-1.5 transition-colors hover:bg-surface-hover hover:text-foreground">
            Tools
          </Link>
          <Link href="/snippets" className="rounded-md px-3 py-1.5 transition-colors hover:bg-surface-hover hover:text-foreground">
            Snippets
          </Link>
          <Link href="/blog" className="rounded-md px-3 py-1.5 transition-colors hover:bg-surface-hover hover:text-foreground">
            Blog
          </Link>
          <Link href="/docs" className="rounded-md px-3 py-1.5 transition-colors hover:bg-surface-hover hover:text-foreground">
            Docs
          </Link>
          <Link href="/extension" className="rounded-md px-3 py-1.5 transition-colors hover:bg-surface-hover hover:text-foreground">
            Extension
          </Link>
          <HeaderDashboardLink />
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-accent transition-colors hover:bg-surface-hover"
          >
            <Heart className="h-3.5 w-3.5" />
            Support
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="w-full max-w-xs">
            <CommandPalette />
          </div>
          <ThemeToggle />
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
