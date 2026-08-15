export type DecodedJwt = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
};

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(segment.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("A JWT must have three parts separated by dots (header.payload.signature).");
  }
  const [headerPart, payloadPart, signature] = parts;
  const header = JSON.parse(base64UrlDecode(headerPart));
  const payload = JSON.parse(base64UrlDecode(payloadPart));
  return { header, payload, signature };
}

const KNOWN_TIME_CLAIMS = ["exp", "iat", "nbf"] as const;

export function getTimeClaims(payload: Record<string, unknown>) {
  return KNOWN_TIME_CLAIMS.filter((claim) => typeof payload[claim] === "number").map((claim) => ({
    claim,
    value: payload[claim] as number,
    date: new Date((payload[claim] as number) * 1000),
  }));
}
