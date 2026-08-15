"use client";

import { CopyButton } from "@/components/copy-button";
import { QrCode } from "@/components/qr-code";
import type { DonateMethod } from "@/lib/donate";
import { logDonateEvent } from "@/lib/firebase/analytics";
import { Bitcoin, Coffee, ExternalLink, QrCode as QrCodeIcon, Smartphone, Wallet } from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";

const METHOD_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  bmc: Coffee,
  om: Smartphone,
  binance: Bitcoin,
};

export function DonateMethodCard({
  method,
  compact = false,
  onAction,
}: {
  method: DonateMethod;
  compact?: boolean;
  /** Called when the user follows the donate link or copies the value — e.g. to snooze a nudge. */
  onAction?: () => void;
}) {
  const Icon = METHOD_ICONS[method.id] ?? Wallet;
  const [qrOpen, setQrOpen] = useState(false);

  function handleAction() {
    logDonateEvent("donate_method_click", { method: method.id, method_name: method.name });
    onAction?.();
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background-subtle px-3 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${method.accentClass}`}>
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{method.name}</p>
            <p className="truncate text-xs text-foreground-subtle">{method.region}</p>
          </div>
        </div>

        {method.href ? (
          <a
            href={method.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAction}
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-accent px-2.5 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:opacity-90"
          >
            Donate
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <CopyButton value={method.value} label="Copy" className="shrink-0 px-2.5 py-1.5" onCopy={handleAction} />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col rounded-xl border p-6 transition-colors ${
        method.highlighted
          ? "border-accent bg-surface shadow-lg shadow-accent/10"
          : "border-border bg-surface hover:border-foreground-subtle"
      }`}
    >
      {method.badge ? (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
          {method.badge}
        </span>
      ) : null}

      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${method.accentClass}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-medium text-foreground">{method.name}</h3>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-subtle">{method.region}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-foreground-muted">{method.note}</p>
      <p className="mt-1 truncate rounded-md bg-background-subtle px-3 py-2 font-mono text-sm text-foreground" title={method.value}>
        {method.value}
      </p>

      {method.showQr ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setQrOpen((open) => !open)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-subtle transition-colors hover:text-foreground"
          >
            <QrCodeIcon className="h-3.5 w-3.5" />
            {qrOpen ? "Hide QR code" : "Show QR code to scan"}
          </button>
          {qrOpen ? (
            <div className="mt-3 flex justify-center">
              <QrCode value={method.value} />
            </div>
          ) : null}
        </div>
      ) : null}

      {method.href ? (
        <a
          href={method.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAction}
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
        >
          {method.ctaLabel}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <CopyButton value={method.value} label={method.ctaLabel} className="mt-4 w-full justify-center py-2" onCopy={handleAction} />
      )}
    </div>
  );
}
