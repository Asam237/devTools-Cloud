"use client";

import { CopyButton } from "@/components/copy-button";
import { Linkedin, Twitter } from "lucide-react";

const iconLinkClass =
  "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:border-foreground-subtle hover:text-foreground";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={twitterHref} target="_blank" rel="noopener noreferrer" className={iconLinkClass}>
        <Twitter className="h-3.5 w-3.5" />
        Post on X
      </a>
      <a href={linkedinHref} target="_blank" rel="noopener noreferrer" className={iconLinkClass}>
        <Linkedin className="h-3.5 w-3.5" />
        Share on LinkedIn
      </a>
      <CopyButton value={url} label="Copy link" />
    </div>
  );
}
