import md5 from "blueimp-md5";

export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export const HASH_ALGORITHMS: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function computeHash(algorithm: HashAlgorithm, text: string): Promise<string> {
  if (algorithm === "MD5") return md5(text);
  const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(text));
  return toHex(digest);
}

export async function computeAllHashes(text: string): Promise<Record<HashAlgorithm, string>> {
  const entries = await Promise.all(
    HASH_ALGORITHMS.map(async (algorithm) => [algorithm, await computeHash(algorithm, text)] as const)
  );
  return Object.fromEntries(entries) as Record<HashAlgorithm, string>;
}
