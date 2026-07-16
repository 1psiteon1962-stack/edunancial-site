import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const targets = [path.join(root, 'src', 'app'), path.join(root, 'src', 'components')];
const excludedFiles = new Set([
  path.join(root, 'src', 'components', 'international', 'BilingualContent.tsx'),
]);
const filePattern = /\.(ts|tsx)$/;
const checks = [
  {
    code: 'deprecated-bilingual-content',
    pattern: /\bBilingualContent\b/g,
    message: 'Deprecated BilingualContent usage found.',
  },
  {
    code: 'deprecated-launch-language-hook',
    pattern: /\buseNorthAmericaLaunchLanguage\b/g,
    message: 'Deprecated useNorthAmericaLaunchLanguage hook found.',
  },
  {
    code: 'deprecated-content-map',
    pattern: /\bcontentByLocale\b/g,
    message: 'Deprecated contentByLocale pattern found.',
  },
  {
    code: 'inline-locale-copy-map',
    pattern: /\bconst\s+copy\s*=\s*\{[\s\S]*?\b(en|es|fr(?:-CA|-FR)?)\s*:/g,
    message: 'Inline locale copy map found; prefer locale JSON catalogs.',
  },
  {
    code: 'inline-track-copy-map',
    pattern: /\bTRACK_CONTENT\b/g,
    message: 'Inline track content map found; prefer locale JSON catalogs.',
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
  return content.slice(0, index).split('\n').length;
}

const files = (await Promise.all(targets.map(walk))).flat().sort();
const findings = [];

for (const file of files) {
  if (excludedFiles.has(file)) {
    continue;
  }
  const content = await readFile(file, 'utf8');
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
}

if (findings.length === 0) {
  console.log('✅ i18n audit passed. No deprecated BilingualContent patterns found.');
  process.exit(0);
}

console.log(`❌ i18n audit found ${findings.length} issue(s):`);
for (const finding of findings) {
  console.log(`- [${finding.code}] ${finding.file}:${finding.line} — ${finding.message}`);
}
process.exit(1);
