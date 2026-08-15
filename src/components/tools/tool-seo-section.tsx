import { FaqAccordion } from "@/components/faq-accordion";
import type { ToolSeo } from "@/lib/tool-seo";

export function ToolSeoSection({ seo }: { seo: ToolSeo }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="mt-16 flex flex-col gap-10 border-t border-border pt-10">
      <section>
        <h2 className="mb-3 text-lg font-medium text-foreground">About this tool</h2>
        <div className="flex flex-col gap-3">
          {seo.intro.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-foreground-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium text-foreground">Frequently asked questions</h2>
        <FaqAccordion items={seo.faq} />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
