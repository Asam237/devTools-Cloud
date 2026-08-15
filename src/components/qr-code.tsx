"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function QrCode({ value, size = 144 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { width: size, margin: 1 }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return <div className="animate-pulse rounded-md bg-background-subtle" style={{ width: size, height: size }} />;
  }

  // eslint-disable-next-line @next/next/no-img-element -- generated data: URL, next/image can't optimize it
  return <img src={dataUrl} alt="Scannable QR code" width={size} height={size} className="rounded-md border border-border" />;
}
