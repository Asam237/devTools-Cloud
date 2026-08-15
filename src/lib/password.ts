const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

type CharsetKey = keyof typeof CHARSETS;

export type PasswordOptions = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

function activePools(options: PasswordOptions): string[] {
  return (Object.keys(CHARSETS) as CharsetKey[]).filter((key) => options[key]).map((key) => CHARSETS[key]);
}

/** Uses crypto.getRandomValues with rejection sampling to avoid modulo bias. */
export function generatePassword(options: PasswordOptions): string {
  const alphabet = activePools(options).join("");
  if (!alphabet || options.length < 1) return "";

  const maxValid = 256 - (256 % alphabet.length);
  const bytes = new Uint8Array(Math.max(options.length * 2, 32));

  let result = "";
  let cursor = bytes.length;

  while (result.length < options.length) {
    if (cursor >= bytes.length) {
      crypto.getRandomValues(bytes);
      cursor = 0;
    }
    const byte = bytes[cursor];
    cursor += 1;
    if (byte >= maxValid) continue;
    result += alphabet[byte % alphabet.length];
  }

  return result;
}

export function estimateEntropyBits(options: PasswordOptions): number {
  const poolSize = activePools(options).reduce((sum, pool) => sum + pool.length, 0);
  if (poolSize === 0 || options.length < 1) return 0;
  return Math.round(options.length * Math.log2(poolSize));
}

export type PasswordStrength = "Weak" | "Fair" | "Strong" | "Very strong";

export function describeStrength(bits: number): PasswordStrength {
  if (bits < 40) return "Weak";
  if (bits < 60) return "Fair";
  if (bits < 80) return "Strong";
  return "Very strong";
}
