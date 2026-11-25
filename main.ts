// Have You Tried Turning It Off? — make.fun entry program.
//
// Writes one funny single-line reply from a hopeless tech support agent
// to a desperate customer into <output>/entry.txt.
// Gate: UTF-8 text, 1 to 199 characters, not only whitespace.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The entry: a twist on the classic "turn it off and on again".
// The agent's cheerful uselessness is the joke — the computer gets
// an apology before the reboot, as if feelings were the bug.
const ENTRY =
  "Have you tried turning it off and on again — and this time, have you tried apologising to it first?";

function validate(text: string): void {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("entry must not be empty");
  }
  if (text.length > 199) {
    throw new Error(`entry is ${text.length} characters, over the 199 limit`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Reject control characters other than plain spaces: the gate wants
  // clean UTF-8 text, and a stray tab or escape would read as noise.
  for (const ch of text) {
    if (ch.charCodeAt(0) < 0x20 && ch !== " ") {
      throw new Error("entry contains a control character");
    }
  }
}

function main(): void {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  // Never remove the output directory itself: on the grader it is a
  // bind mount, so only create it and write inside it.
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");
  // Read back and re-validate what actually landed on disk.
  const written = readFileSync(target, "utf8");
  validate(written);
  if (written !== ENTRY) {
    throw new Error("written entry differs from the entry text");
  }
  console.log(`wrote ${target} (${ENTRY.length} characters)`);
}

main();
