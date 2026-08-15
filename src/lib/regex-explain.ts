const TOKEN_EXPLANATIONS: Array<{ pattern: RegExp; describe: (match: string) => string }> = [
  { pattern: /^\^/, describe: () => "^ — start of string (or line, in multiline mode)" },
  { pattern: /^\$/, describe: () => "$ — end of string (or line, in multiline mode)" },
  { pattern: /^\\d/, describe: () => "\\d — a digit (0-9)" },
  { pattern: /^\\D/, describe: () => "\\D — a non-digit" },
  { pattern: /^\\w/, describe: () => "\\w — a word character (letters, digits, underscore)" },
  { pattern: /^\\W/, describe: () => "\\W — a non-word character" },
  { pattern: /^\\s/, describe: () => "\\s — a whitespace character" },
  { pattern: /^\\S/, describe: () => "\\S — a non-whitespace character" },
  { pattern: /^\\b/, describe: () => "\\b — a word boundary" },
  { pattern: /^\./, describe: () => ". — any character except line break" },
  { pattern: /^\*/, describe: () => "* — zero or more of the previous token" },
  { pattern: /^\+/, describe: () => "+ — one or more of the previous token" },
  { pattern: /^\?/, describe: () => "? — zero or one of the previous token (optional)" },
  { pattern: /^\{\d+(,\d*)?\}/, describe: (m) => `${m} — a specific number of repetitions` },
  { pattern: /^\(\?:/, describe: () => "(?: — start of a non-capturing group" },
  { pattern: /^\(\?</, describe: () => "(?<name> — start of a named capturing group" },
  { pattern: /^\(/, describe: () => "( — start of a capturing group" },
  { pattern: /^\)/, describe: () => ") — end of a group" },
  { pattern: /^\[\^/, describe: () => "[^ — start of a negated character class" },
  { pattern: /^\[/, describe: () => "[ — start of a character class" },
  { pattern: /^\]/, describe: () => "] — end of a character class" },
  { pattern: /^\|/, describe: () => "| — alternation (OR)" },
];

export function explainRegex(source: string): string[] {
  const explanations: string[] = [];
  let remaining = source;
  let guard = 0;
  while (remaining.length > 0 && guard < 200) {
    guard += 1;
    const match = TOKEN_EXPLANATIONS.find((entry) => entry.pattern.test(remaining));
    if (match) {
      const [consumed] = remaining.match(match.pattern) ?? [""];
      explanations.push(match.describe(consumed));
      remaining = remaining.slice(consumed.length || 1);
    } else {
      remaining = remaining.slice(1);
    }
  }
  return explanations;
}

export const REGEX_EXAMPLES = [
  { label: "Email address", pattern: "^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$", flags: "" },
  { label: "URL", pattern: "https?:\\/\\/[\\w.-]+\\.[a-zA-Z]{2,}(\\/\\S*)?", flags: "g" },
  { label: "IPv4 address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Hex color", pattern: "#[0-9a-fA-F]{3,6}\\b", flags: "g" },
  { label: "Digits only", pattern: "^\\d+$", flags: "" },
];
