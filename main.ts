import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

function getEntryLine(): string {
  return "You ring at 6 AM Saturday like a broke coworker begging for attention — no job, no life, just you and your desperate beeping career.";
}

function validateLine(line: string): void {
  if (!line || line.trim().length === 0) {
    throw new Error("Line must not be empty");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Line must be a single line without newline");
  }
  if (line.length > 200) {
    throw new Error(`Line exceeds 200 characters: ${line.length}`);
  }
}

function main(): void {
  const line = getEntryLine();
  validateLine(line);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "out";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "entry.txt");
  fs.writeFileSync(outPath, line, "utf8");

  const readBack = fs.readFileSync(outPath, "utf8");
  if (readBack !== line) {
    throw new Error("Read-back verification failed: written content does not match");
  }
  if (readBack.endsWith("\n")) {
    throw new Error("Output must not end with newline");
  }

  const hash = crypto.createHash("sha256").update(readBack, "utf8").digest("hex");
  console.log(`entry.txt written: ${line.length} chars, sha256=${hash}`);
}

main();
