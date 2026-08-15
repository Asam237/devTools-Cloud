import { DonateMethodCard } from "@/components/donate-method-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { DONATE_METHODS } from "@/lib/donate";
import { DONATE_FAQ } from "@/lib/pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support DevTools Cloud",
  description:
    "DevTools Cloud is free forever — no tiers, no paywall. Card billing isn't available yet for merchants based in Cameroon, so support development directly via Buy Me a Coffee, Orange Money, or crypto.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Every tool is free. Forever.
        </h1>
        <p className="mt-4 text-foreground-muted">
          No tiers, no paywall, no account required. Card processors like Stripe don&apos;t currently support
          merchants based in Cameroon, so a subscription plan isn&apos;t billable yet — instead, if DevTools Cloud
          has saved you time, you can support it directly below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {DONATE_METHODS.map((method) => (
          <DonateMethodCard key={method.id} method={method} />
        ))}
      </div>

      <section className="mt-16">
        <h2 className="mb-5 text-lg font-medium text-foreground">Frequently asked questions</h2>
        <FaqAccordion items={DONATE_FAQ} />
      </section>
    </div>
  );
}
