import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { LANGUAGE_CATALOG, getLocaleFallbackChain } from "../src/lib/international/languages.ts";

const root = process.cwd();
const localesDir = path.join(root, "src", "locales");
const scanTargets = [
  path.join(root, "src", "app"),
  path.join(root, "src", "components"),
  path.join(root, "src", "lib"),
];
const excludedFiles = new Set([
  path.join(root, "src", "components", "international", "BilingualContent.tsx"),
]);
const filePattern = /\.(ts|tsx)$/;

const checks = [
  {
    code: "deprecated-bilingual-content",
    pattern: /\bBilingualContent\b/g,
    message: "Deprecated BilingualContent usage found.",
  },
  {
    code: "deprecated-launch-language-hook",
    pattern: /\buseNorthAmericaLaunchLanguage\b/g,
    message: "Deprecated useNorthAmericaLaunchLanguage hook found.",
  },
  {
    code: "deprecated-content-map",
    pattern: /\bcontentByLocale\b/g,
    message: "Deprecated contentByLocale pattern found.",
  },
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return filePattern.test(entry.name) ? [fullPath] : [];
    }),
  );

  return files.flat();
}

function getLine(content, index) {
  return content.slice(0, index).split("\n").length;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function resolveLocaleFileCode(localeCode, availableFiles) {
  const exact = availableFiles.has(localeCode) ? localeCode : null;
  if (exact) {
    return exact;
  }

  return getLocaleFallbackChain(localeCode).find((candidate) => availableFiles.has(candidate)) ?? null;
}

function collectLiteralTranslationKeys(content) {
  const keys = new Set();
  const patterns = [
    /\bt\(\s*["'`]([^"'`]+)["'`]/g,
    /\btranslate\(\s*[^,]+,\s*["'`]([^"'`]+)["'`]/g,
  ];

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      if (match[1]) {
        if (!match[1].includes("${")) {
          keys.add(match[1]);
        }
      }
    }
  }

  return keys;
}

const localeFiles = (await readdir(localesDir))
  .filter((entry) => entry.endsWith(".json"))
  .map((entry) => entry.replace(/\.json$/u, ""));
const localeFileSet = new Set(localeFiles);

const englishMessages = await readJson(path.join(localesDir, "en.json"));
const englishKeys = Object.keys(englishMessages);
const englishKeySet = new Set(englishKeys);

const files = (await Promise.all(scanTargets.map(walk))).flat().sort();
const findings = [];
const referencedKeys = new Map();

for (const file of files) {
  if (excludedFiles.has(file)) {
    continue;
  }

  const content = await readFile(file, "utf8");
  const relativePath = path.relative(root, file);

  for (const check of checks) {
    for (const match of content.matchAll(check.pattern)) {
      findings.push({
        file: relativePath,
        line: getLine(content, match.index ?? 0),
        code: check.code,
        message: check.message,
      });
    }
  }

  for (const key of collectLiteralTranslationKeys(content)) {
    if (!referencedKeys.has(key)) {
      referencedKeys.set(key, []);
    }
    referencedKeys.get(key).push(relativePath);
  }
}

const missingEnglishKeys = [...referencedKeys.keys()]
  .filter((key) => !englishKeySet.has(key))
  .sort();

const localeReports = await Promise.all(LANGUAGE_CATALOG.map(async (language) => {
  const fileCode = resolveLocaleFileCode(language.code, localeFileSet);
  const messages = fileCode ? await readJson(path.join(localesDir, `${fileCode}.json`)) : null;
  const malformedKeys = [];
  const missingKeys = [];
  let fallbackKeys = 0;
  let translatedKeys = 0;

  if (messages) {
    for (const key of englishKeys) {
      if (!(key in messages)) {
        missingKeys.push(key);
        continue;
      }

      if (typeof messages[key] !== "string") {
        malformedKeys.push(key);
        continue;
      }

      if (messages[key] === englishMessages[key]) {
        fallbackKeys += 1;
      } else {
        translatedKeys += 1;
      }
    }
  }

  return {
    locale: language.code,
    fileCode,
    totalKeys: englishKeys.length,
    translatedKeys,
    fallbackKeys,
    missingKeys,
    malformedKeys,
  };
}));

console.log("i18n audit summary");
console.log(`- canonical registry: src/lib/international/languages.ts`);
console.log(`- enabled locales: ${LANGUAGE_CATALOG.map((language) => language.code).join(", ")}`);
console.log(`- english keys: ${englishKeys.length}`);

for (const report of localeReports) {
  console.log(
    `- ${report.locale} -> ${report.fileCode ?? "missing"} | translated=${report.translatedKeys} fallback=${report.fallbackKeys} missing=${report.missingKeys.length} malformed=${report.malformedKeys.length}`,
  );
}

if (missingEnglishKeys.length > 0) {
  console.log(`\nMissing English keys referenced in code (${missingEnglishKeys.length}):`);
  for (const key of missingEnglishKeys) {
    console.log(`- ${key} (${referencedKeys.get(key).slice(0, 3).join(", ")})`);
  }
}

if (findings.length > 0) {
  console.log(`\nDeprecated i18n findings (${findings.length}):`);
  for (const finding of findings) {
    console.log(`- [${finding.code}] ${finding.file}:${finding.line} — ${finding.message}`);
  }
}

const blockingLocaleIssues = localeReports.filter(
  (report) =>
    !report.fileCode ||
    report.missingKeys.length > 0 ||
    report.malformedKeys.length > 0,
);

if (missingEnglishKeys.length > 0 || findings.length > 0 || blockingLocaleIssues.length > 0) {
  console.log("\n❌ i18n audit failed.");
  process.exit(1);
}

console.log("\n✅ i18n audit passed.");
