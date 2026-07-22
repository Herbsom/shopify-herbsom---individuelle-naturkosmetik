import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const clientSourceRoot = path.join(projectRoot, "client", "src");
const supportedExtensions = new Set([".ts", ".tsx", ".css", ".html", ".json"]);

function walk(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolutePath);
    return supportedExtensions.has(path.extname(entry.name)) ? [absolutePath] : [];
  });
}

function collectImageReferences(): string[] {
  const references = new Set<string>();
  const pattern = /\/(?:images|manus-storage)\/[^"'`\s)>,]+/g;

  for (const filename of walk(clientSourceRoot)) {
    const source = fs.readFileSync(filename, "utf8");
    for (const match of source.matchAll(pattern)) {
      references.add(match[0].replace(/[.;]+$/, ""));
    }
  }

  return [...references].sort();
}

describe("client image asset references", () => {
  it("uses only project web assets instead of removed local image files", () => {
    const references = collectImageReferences();

    expect(references.length).toBeGreaterThan(0);
    expect(references.filter((reference) => reference.startsWith("/images/"))).toEqual([]);
    expect(references.every((reference) => reference.startsWith("/manus-storage/"))).toBe(true);
  });

  it("contains none of the unavailable legacy image identifiers", () => {
    const references = collectImageReferences();
    const unavailableFragments = [
      "_142cd424",
      "e0123456-7890-4321-abcd-1234567890ab",
      "_6932f904.jpg",
      "_f6b3083b.png",
    ];

    for (const fragment of unavailableFragments) {
      expect(references.some((reference) => reference.includes(fragment))).toBe(false);
    }
  });
});
