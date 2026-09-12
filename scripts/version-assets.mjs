import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const publicDirectory = new URL("../public/", import.meta.url);
const homepage = new URL("index.html", publicDirectory);
const original = await readFile(homepage, "utf8");
let versioned = original;

for (const [filename, attribute] of [
  ["styles.css", "href"],
  ["landing.js", "src"],
]) {
  const contents = await readFile(new URL(filename, publicDirectory));
  const version = createHash("sha256")
    .update(contents)
    .digest("hex")
    .slice(0, 12);
  const reference = new RegExp(
    `${attribute}="/${filename.replace(".", "\\.")}(?:\\?v=[a-f0-9]+)?"`,
    "g",
  );
  if ([...versioned.matchAll(reference)].length !== 1) {
    throw new Error(`Expected exactly one homepage reference to ${filename}`);
  }
  versioned = versioned.replace(
    reference,
    `${attribute}="/${filename}?v=${version}"`,
  );
}

if (process.argv.includes("--check")) {
  if (versioned !== original) {
    console.error("Homepage asset versions are stale. Run npm run format.");
    process.exitCode = 1;
  }
} else if (versioned !== original) {
  await writeFile(homepage, versioned);
  console.log("Updated homepage asset versions.");
}
