export type DonateFaq = { question: string; answer: string };

export const DONATE_FAQ: DonateFaq[] = [
  {
    question: "Do I need to donate to use the tools?",
    answer:
      "No, never. Every tool in the toolbox works fully client-side with no sign-up and no payment. Donations are optional and go toward hosting and continued development.",
  },
  {
    question: "Why donations instead of a paid plan?",
    answer:
      "Card processors like Stripe don't currently support merchants based in Cameroon, so a subscription plan isn't billable yet. Direct donations (Buy Me a Coffee, crypto) work today and go straight to keeping the project running.",
  },
  {
    question: "Will free tools ever be paywalled?",
    answer: "No. The core client-side tools stay free forever — donations are a thank-you, not a requirement.",
  },
  {
    question: "Is there a minimum amount?",
    answer: "No minimum — send whatever feels right. Every contribution, however small, directly funds hosting and new tools.",
  },
];
