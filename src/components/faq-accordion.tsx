"use client";

import type { ToolFaq } from "@/lib/tool-seo";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FaqAccordion({ items }: { items: ToolFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className="text-sm font-medium text-foreground">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-foreground-subtle transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open ? <p className="px-5 pb-4 text-sm leading-relaxed text-foreground-muted">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
