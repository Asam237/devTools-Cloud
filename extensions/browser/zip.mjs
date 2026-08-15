import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";

const outFile = "devtools-cloud-extension.zip";

if (!existsSync("dist")) {
  console.error("dist/ not found — run `npm run build` first.");
  process.exit(1);
}

rmSync(outFile, { force: true });
execFileSync("zip", ["-r", `../${outFile}`, "."], { cwd: "dist", stdio: "inherit" });
console.log(`Wrote ${outFile}`);
