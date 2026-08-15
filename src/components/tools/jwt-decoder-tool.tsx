"use client";

import { CopyButton } from "@/components/copy-button";
import { JsonHighlight } from "@/components/json-highlight";
import { decodeJwt, getTimeClaims } from "@/lib/jwt";
import { useHistoryDataRecorder } from "@/lib/use-history-data-recorder";
import { useRestorableInput } from "@/lib/use-restorable-input";
import { labelClass, panelClass, secondaryButtonClass, textareaClass } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzAyMzkwMjJ9.dQw4w9WgXcQ-dQw4w9WgXcQ-dQw4w9WgXcQ";

export function JwtDecoderTool() {
  const [token, setToken] = useRestorableInput("jwt-decoder", "");

  useHistoryDataRecorder("jwt-decoder", token);

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      return { data: decodeJwt(token), error: null as string | null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "Invalid token" };
    }
  }, [token]);

  const timeClaims = decoded?.data ? getTimeClaims(decoded.data.payload) : [];
  const expClaim = timeClaims.find((claim) => claim.claim === "exp");

  const [isExpired, setIsExpired] = useState<boolean | null>(null);
  useEffect(() => {
    // Comparing against the current time is only meaningful — and only
    // deterministic — once we're running on the client after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/purity
    setIsExpired(expClaim ? expClaim.date.getTime() < Date.now() : null);
  }, [expClaim]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setToken(SAMPLE)} className={secondaryButtonClass}>
          Load sample
        </button>
        <p className="text-xs text-foreground-subtle">Decoding happens entirely in your browser — nothing is sent to a server.</p>
      </div>

      <div>
        <label className={labelClass}>JWT</label>
        <textarea
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Paste a JWT (header.payload.signature)..."
          spellCheck={false}
          className={`${textareaClass} h-28`}
        />
      </div>

      {decoded?.error ? (
        <p className="flex items-center gap-1.5 text-xs text-danger">
          <AlertCircle className="h-3.5 w-3.5" />
          {decoded.error}
        </p>
      ) : null}

      {decoded?.data ? (
        <div className="flex flex-col gap-4">
          {expClaim ? (
            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${
                isExpired ? "border-danger/30 bg-danger/5 text-danger" : "border-success/30 bg-success/5 text-success"
              }`}
            >
              {isExpired ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              {isExpired ? "Token expired" : "Token valid"} — expires {expClaim.date.toLocaleString()}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wide text-foreground-subtle">Header</label>
                <CopyButton value={JSON.stringify(decoded.data.header, null, 2)} className="px-2 py-1" />
              </div>
              <JsonHighlight
                json={JSON.stringify(decoded.data.header, null, 2)}
                className={`${panelClass} overflow-auto px-3.5 py-3 font-mono text-sm`}
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wide text-foreground-subtle">Payload</label>
                <CopyButton value={JSON.stringify(decoded.data.payload, null, 2)} className="px-2 py-1" />
              </div>
              <JsonHighlight
                json={JSON.stringify(decoded.data.payload, null, 2)}
                className={`${panelClass} overflow-auto px-3.5 py-3 font-mono text-sm`}
              />
            </div>
          </div>

          {timeClaims.length > 0 ? (
            <div>
              <label className={labelClass}>Temporal claims</label>
              <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
                {timeClaims.map((claim) => (
                  <div key={claim.claim} className="flex items-center gap-2 text-sm">
                    <Clock className="h-3.5 w-3.5 text-foreground-subtle" />
                    <span className="font-mono text-foreground-muted">{claim.claim}</span>
                    <span className="text-foreground-subtle">{claim.value}</span>
                    <span className="text-foreground">→ {claim.date.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wide text-foreground-subtle">Signature</label>
              <CopyButton value={decoded.data.signature} className="px-2 py-1" />
            </div>
            <p className="break-all rounded-lg border border-border bg-background-subtle px-3.5 py-2.5 font-mono text-xs text-foreground-muted">
              {decoded.data.signature}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
