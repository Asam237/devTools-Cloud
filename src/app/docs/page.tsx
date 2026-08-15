import { ContentBody } from "@/components/content-body";
import { FaqAccordion } from "@/components/faq-accordion";
import { DOCS_FAQ, DOCS_SECTIONS } from "@/lib/docs-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description: "How DevTools Cloud works, how your data is handled, and answers to common questions.",
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Documentation</h1>
        <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
          What DevTools Cloud is, how it handles your data, and how to get around.
        </p>
      </div>

      <nav className="mb-10 flex flex-wrap gap-2 border-b border-border pb-6">
        {DOCS_SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground-muted transition-colors hover:border-foreground-subtle hover:text-foreground"
          >
            {section.title}
          </a>
        ))}
        <a
          href="#faq"
          className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground-muted transition-colors hover:border-foreground-subtle hover:text-foreground"
        >
          FAQ
        </a>
      </nav>

      <div className="flex flex-col gap-12">
        {DOCS_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="mb-3 text-lg font-medium text-foreground">{section.title}</h2>
            <ContentBody blocks={section.body} />
          </section>
        ))}

        <section id="faq" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-medium text-foreground">Frequently asked questions</h2>
          <FaqAccordion items={DOCS_FAQ} />
        </section>
      </div>
    </div>
  );
}
