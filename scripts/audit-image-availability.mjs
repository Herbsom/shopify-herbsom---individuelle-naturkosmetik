import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = path.join(projectRoot, "client");
const previewBase =
  process.env.IMAGE_AUDIT_BASE_URL ??
  "https://3000-i2jpdvklqdsuqn7439cdy-a8493557.us2.manus.computer";
const reportPath = path.join(projectRoot, "notes", "image-availability-audit.json");
const sourceExtensions = new Set([".ts", ".tsx", ".css", ".json", ".html"]);

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectFiles(absolute);
      return sourceExtensions.has(path.extname(entry.name)) ? [absolute] : [];
    })
  );
  return nested.flat();
}

function collectImageUrls(text) {
  const matches = new Set();
  const absolutePattern = /https?:\/\/[^\s"'`)<]+?\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?[^\s"'`)<]*)?/gi;
  const storagePattern = /\/manus-storage\/[A-Za-z0-9._~%+()=-]+/g;

  for (const match of text.matchAll(absolutePattern)) matches.add(match[0]);
  for (const match of text.matchAll(storagePattern)) matches.add(match[0]);
  return matches;
}

async function checkUrl(sourceUrl) {
  const requestUrl = sourceUrl.startsWith("/")
    ? new URL(sourceUrl, previewBase).toString()
    : sourceUrl;
  const startedAt = Date.now();

  try {
    let response = await fetch(requestUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });

    if (response.status === 405 || response.status === 403) {
      response = await fetch(requestUrl, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
      });
    }

    return {
      sourceUrl,
      requestUrl,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      durationMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      sourceUrl,
      requestUrl,
      ok: false,
      status: null,
      contentType: null,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const files = await collectFiles(sourceRoot);
const urlSet = new Set();
for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const url of collectImageUrls(text)) urlSet.add(url);
}

const urls = [...urlSet].sort();
const results = [];
const concurrency = 10;
for (let index = 0; index < urls.length; index += concurrency) {
  const batch = urls.slice(index, index + concurrency);
  results.push(...(await Promise.all(batch.map(checkUrl))));
}

const broken = results.filter((result) => !result.ok);
const report = {
  generatedAt: new Date().toISOString(),
  previewBase,
  scannedFiles: files.length,
  totalUrls: results.length,
  availableUrls: results.length - broken.length,
  brokenUrls: broken.length,
  results,
};

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(
  JSON.stringify(
    {
      scannedFiles: report.scannedFiles,
      totalUrls: report.totalUrls,
      availableUrls: report.availableUrls,
      brokenUrls: report.brokenUrls,
      reportPath,
    },
    null,
    2
  )
);

if (broken.length > 0) process.exitCode = 1;
