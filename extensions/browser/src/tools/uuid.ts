import { v4 as uuidv4, v7 as uuidv7 } from "uuid";

export function generateUuid(version: "v4" | "v7"): string {
  return version === "v4" ? uuidv4() : uuidv7();
}
