export type DonateMethod = {
  id: string;
  name: string;
  region: string;
  note: string;
  /** Primary displayed value — a phone number, handle, or wallet address. */
  value: string;
  /** If set, the value can be copied with one click. */
  copyable?: boolean;
  /** If set, the card links out to this URL instead of (or alongside) copying. */
  href?: string;
  ctaLabel: string;
  /** Tailwind classes for the method's icon badge — one accent color per brand. */
  accentClass: string;
  /** Marks the easiest/most universal option so it stands out in the full card layout. */
  highlighted?: boolean;
  badge?: string;
  /** If set, the card offers a scannable QR code of `value` — wallet addresses only, where scanning is the standard transfer flow. */
  showQr?: boolean;
};

export const DONATE_METHODS: DonateMethod[] = [
  {
    id: "bmc",
    name: "Buy Me a Coffee",
    region: "Worldwide · any card",
    note: "No account needed, pay by card in seconds",
    value: "buymeacoffee.com/abbasaliab3",
    href: "buymeacoffee.com/abbasaliab3",
    ctaLabel: "Buy me a coffee",
    accentClass: "bg-[#FFDD00]/25 text-[#8a6d00] dark:text-[#FFDD00]",
    highlighted: true,
    badge: "Easiest — works everywhere",
  },
  {
    id: "binance",
    name: "Binance Pay / USDT",
    region: "Worldwide · crypto",
    note: "USDT, TRX network",
    value: "TDG46cdrVaBE2B6nW7Qn3CbgFhESh6DRpa",
    copyable: true,
    ctaLabel: "Copy wallet address",
    accentClass: "bg-[#F0B90B]/15 text-[#b3860a] dark:text-[#F0B90B]",
    showQr: true,
  },
];
