import { DonateMethodCard } from "@/components/donate-method-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { DONATE_METHODS } from "@/lib/donate";
import { DONATE_FAQ } from "@/lib/pricing";
import { Heart, Infinity as InfinityIcon, ShieldCheck, Terminal } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support DevTools Cloud",
  description:
    "DevTools Cloud is free forever — no tiers, no paywall. Card billing isn't available yet for merchants based in Cameroon, so support development directly via Buy Me a Coffee or crypto.",
  alternates: { canonical: "/pricing" },
};

const TRUST_POINTS = [
  { icon: InfinityIcon, label: "Free forever" },
  { icon: ShieldCheck, label: "No account needed" },
  { icon: Terminal, label: "Runs 100% client-side" },
];

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[32rem] w-[64rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/20 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-16 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-accent">
            <Heart className="h-4 w-4" />
            Support the project
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Every tool is free. Forever.
          </h1>
          <p className="mt-4 text-balance text-foreground-muted">
            No tiers, no paywall, no account required. Card processors like Stripe don&apos;t currently support
            merchants based in Cameroon, so a subscription plan isn&apos;t billable yet — if DevTools Cloud has
            saved you time, you can support it directly below.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-foreground-subtle">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-accent" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {DONATE_METHODS.map((method) => (
            <DonateMethodCard key={method.id} method={method} />
          ))}
        </div>

        <section className="mt-20">
          <h2 className="mb-5 text-lg font-medium text-foreground">Frequently asked questions</h2>
          <FaqAccordion items={DONATE_FAQ} />
        </section>
      </div>
    </div>
  );
}
