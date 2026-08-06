import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const targets = [path.join(root, 'src', 'app'), path.join(root, 'src', 'components'), path.join(root, 'src', 'lib')];
const filePattern = /\.(ts|tsx)$/;

const checks = [
  {
    code: 'deprecated-bilingual-content',
    pattern: /\bBilingualContent\b/g,
    message: 'Deprecated BilingualContent usage found. Use useInternationalPreferences().t() instead.',
  },
  {
    code: 'deprecated-launch-language-hook',
    pattern: /\buseNorthAmericaLaunchLanguage\b/g,
    message: 'Deprecated useNorthAmericaLaunchLanguage hook found. Use useInternationalPreferences() instead.',
  },
  {
    code: 'deprecated-content-map',
    pattern: /\bcontentByLocale\b/g,
    message: 'Deprecated contentByLocale pattern found. Use locale JSON catalog keys instead.',
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
  {
    code: 'legacy-i18n-import',
    pattern: /from\s+['"]@\/lib\/i18n['"]/g,
    message: 'Import from legacy @/lib/i18n detected. Use @/lib/international/i18n or useInternationalPreferences() instead.',
  },
  {
    code: 'legacy-language-selector',
    pattern: /localStorage\.setItem\s*\(\s*['"]edunancial-language['"]/g,
    message: 'Legacy edunancial-language localStorage key found. Use canonical InternationalPreferencesProvider instead.',
  },
  {
    code: 'window-location-reload-on-lang',
    // Heuristic: window.location.reload in a language-change context
    pattern: /window\.location\.reload\s*\(\s*\)/g,
    message: 'window.location.reload() found. Language switching should use InternationalPreferencesProvider context (no page reload).',
  },
  {
    code: 'hardcoded-locale-branch',
    pattern: /locale\s*===\s*['"](?:ja|ko|zh-Hans|zh-Hant|hi|ar|es|fr)['"]\s*\?/g,
    message: 'Hardcoded locale ternary detected. Use locale JSON catalog keys via t() instead.',
  },
];

// Files that are themselves the canonical system (not violations)
const excludedFiles = new Set([
  path.join(root, 'src', 'lib', 'international', 'languages.ts'),
  path.join(root, 'src', 'lib', 'international', 'i18n.ts'),
  path.join(root, 'src', 'lib', 'international', 'preferences.ts'),
  path.join(root, 'src', 'lib', 'i18n', 'config.ts'),
  path.join(root, 'src', 'lib', 'i18n', 'geo-map.ts'),
  path.join(root, 'src', 'components', 'international', 'BilingualContent.tsx'),
  path.join(root, 'src', 'components', 'international', 'InternationalPreferencesProvider.tsx'),
  path.join(root, 'src', 'components', 'international', 'LanguagePreferenceSelector.tsx'),
]);

// window.location.reload is allowed outside of language-context files
const reloadAllowedFiles = new Set([
  path.join(root, 'src', 'components', 'international', 'InternationalPreferencesProvider.tsx'),
]);

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
    if (check.code === 'window-location-reload-on-lang' && reloadAllowedFiles.has(file)) {
      continue;
    }
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
  console.log('✅ i18n audit passed. Single-pipeline architecture enforced.');
  process.exit(0);
}

console.log(`❌ i18n audit found ${findings.length} issue(s):`);
for (const finding of findings) {
  console.log(`- [${finding.code}] ${finding.file}:${finding.line} — ${finding.message}`);
}
process.exit(1);
