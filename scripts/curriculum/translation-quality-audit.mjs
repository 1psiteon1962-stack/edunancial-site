#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const root = process.cwd();
const curriculumRoot = join(root, 'content', 'curriculum');
const translationsRoot = join(root, 'content', 'courses');
const reportsRoot = join(root, 'curriculum', 'reports');
const jsonPath = join(reportsRoot, 'TRANSLATION-QUALITY.json');
const csvPath = join(reportsRoot, 'TRANSLATION-QUALITY.csv');
const mdPath = join(reportsRoot, 'TRANSLATION-QUALITY.md');

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function lessonIdFrom(value) {
  return String(value ?? '').toUpperCase().match(/([A-Z]+-L\d+-\d{3})/u)?.[1] ?? null;
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/u);
  if (!match) return { frontMatter: {}, body: raw };
  const frontMatter = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const index = line.indexOf(':');
    if (index < 0) continue;
    frontMatter[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^['"]|['"]$/gu, '');
  }
  return { frontMatter, body: match[2] };
}

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/[#*_>`~\[\](){},.!?:;"'“”‘’—–-]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function tokenSet(value) {
  return new Set(normalizeText(value).split(' ').filter((token) => token.length > 2));
}

function similarity(a, b) {
  const aa = tokenSet(a);
  const bb = tokenSet(b);
  if (!aa.size || !bb.size) return 0;
  let intersection = 0;
  for (const token of aa) if (bb.has(token)) intersection += 1;
  return intersection / Math.max(aa.size, bb.size);
}

function canonicalFingerprint(title, summary, body) {
  return `sha256:${createHash('sha256').update(normalizeText(`${title}\n${summary}\n${body}`)).digest('hex')}`;
}

function canonicalSections(body) {
  const headings = [...String(body ?? '').matchAll(/^#{2,3}\s+(.+)$/gmu)].map((match) => normalizeText(match[1]));
  const groups = {
    objectives: /learning objectives|objectives/u,
    definitions: /definitions?|key terms?/u,
    examples: /examples?|worked example/u,
    scenarios: /scenarios?|case study/u,
    questions: /quiz|questions?|knowledge check|practice/u,
    answers: /answer key|answers and explanations|worked solution|solutions?/u,
    takeaways: /key takeaways?|summary/u,
  };
  return Object.fromEntries(Object.entries(groups).map(([name, pattern]) => [name, headings.some((heading) => pattern.test(heading))]));
}

function translatedSections(body) {
  const normalized = normalizeText(body);
  const patterns = {
    objectives: /learning objectives|obiettivi|objetivos|objectifs|lernziele|doelstellingen|objectivos/u,
    definitions: /definitions?|definizioni|definiciones|définitions|definitionen|definities|definições/u,
    examples: /examples?|esempio|ejemplo|exemple|beispiel|voorbeeld|exemplo/u,
    scenarios: /scenario|escenario|scénario|szenario/u,
    questions: /quiz|question|domanda|pregunta|frage|vraag|pergunta/u,
    answers: /answer|risposta|respuesta|réponse|antwort|antwoord|resposta|soluzione|solution/u,
    takeaways: /takeaway|punti chiave|puntos clave|points clés|wichtig|belangrijk|pontos-chave/u,
  };
  return Object.fromEntries(Object.entries(patterns).map(([name, pattern]) => [name, pattern.test(normalized)]));
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

const canonical = new Map();
for (const path of walk(curriculumRoot).filter((candidate) => candidate.endsWith('.md'))) {
  const raw = readFileSync(path, 'utf8');
  const id = lessonIdFrom(path) ?? lessonIdFrom(raw);
  if (!id) continue;
  const parsed = parseFrontMatter(raw);
  const title = parsed.frontMatter.title ?? '';
  const summary = parsed.frontMatter.summary ?? '';
  canonical.set(id, {
    id,
    track: id.split('-')[0],
    level: Number(id.match(/-L(\d+)-/u)?.[1] ?? 0),
    title,
    summary,
    body: parsed.body,
    sections: canonicalSections(parsed.body),
    fingerprint: canonicalFingerprint(title, summary, parsed.body),
    path: relative(root, path).replaceAll('\\', '/'),
  });
}

const translations = new Map();
function addTranslation(id, locale, value, path) {
  if (!id || !locale || !value || typeof value !== 'object' || Array.isArray(value)) return;
  const key = `${id}::${locale}`;
  const list = translations.get(key) ?? [];
  list.push({
    id,
    locale,
    title: typeof value.title === 'string' ? value.title.trim() : '',
    summary: typeof value.summary === 'string' ? value.summary.trim() : '',
    body: typeof value.body === 'string' ? value.body.trim() : '',
    sourceFingerprint: value.sourceFingerprint ?? value.canonicalFingerprint ?? null,
    sourceVersion: value.sourceVersion ?? null,
    path: relative(root, path).replaceAll('\\', '/'),
  });
  translations.set(key, list);
}

for (const path of walk(translationsRoot).filter((candidate) => candidate.endsWith('.json'))) {
  const parsed = readJson(path);
  if (!parsed) continue;
  const records = Array.isArray(parsed) ? parsed : [parsed];
  for (const record of records) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) continue;
    const id = lessonIdFrom(record.id ?? record.lessonId) ?? lessonIdFrom(path);
    if (!id) continue;
    if (record.translations && typeof record.translations === 'object' && !Array.isArray(record.translations)) {
      for (const [locale, value] of Object.entries(record.translations)) addTranslation(id, locale, value, path);
    }
    if (record.locale) addTranslation(id, record.locale, record, path);
  }
}

const rows = [];
for (const [key, entries] of translations) {
  const [id, locale] = key.split('::');
  const source = canonical.get(id);
  if (!source) {
    rows.push({ academy: id.split('-')[0], level: Number(id.match(/-L(\d+)-/u)?.[1] ?? 0), lesson_id: id, locale, canonical_exists: false, title_status: 'N/A', summary_status: 'N/A', body_status: 'N/A', content_structure_status: 'N/A', english_copythrough_status: 'N/A', canonical_version_status: 'N/A', overall_status: 'ORPHAN', required_action: 'Remove or reconcile translation with an active canonical lesson ID' });
    continue;
  }
  if (entries.length > 1) {
    rows.push({ academy: source.track, level: source.level, lesson_id: id, locale, canonical_exists: true, title_status: 'CHECK', summary_status: 'CHECK', body_status: 'CHECK', content_structure_status: 'CHECK', english_copythrough_status: 'CHECK', canonical_version_status: 'CHECK', overall_status: 'DUPLICATE', required_action: `Resolve ${entries.length} competing translation artifacts` });
    continue;
  }

  const translation = entries[0];
  const titleStatus = translation.title ? 'PRESENT' : 'MISSING';
  const summaryStatus = translation.summary ? 'PRESENT' : 'MISSING';
  const bodyStatus = translation.body ? 'PRESENT' : 'MISSING';
  const bodyRatio = source.body ? translation.body.length / source.body.length : 1;
  const bodySimilarity = similarity(source.body, translation.body);
  const copyThrough = bodySimilarity >= 0.72 && normalizeText(source.body).length > 100;
  const suspiciouslyShort = Boolean(translation.body) && bodyRatio < 0.35 && source.body.length > 600;
  const sourceSections = source.sections;
  const targetSections = translatedSections(translation.body);
  const requiredSections = Object.entries(sourceSections).filter(([, present]) => present).map(([name]) => name);
  const missingSections = requiredSections.filter((name) => !targetSections[name]);
  const structureStatus = missingSections.length ? `MISSING:${missingSections.join('|')}` : 'PRESENT';
  const stale = Boolean(translation.sourceFingerprint && translation.sourceFingerprint !== source.fingerprint);
  const canonicalVersionStatus = stale ? 'STALE' : translation.sourceFingerprint ? 'CURRENT' : 'UNTRACKED';

  let overallStatus = 'COMPLETE';
  let requiredAction = 'None';
  if (!translation.title && !translation.summary && !translation.body) {
    overallStatus = 'MISSING';
    requiredAction = 'Create substantive translation';
  } else if (copyThrough || suspiciouslyShort) {
    overallStatus = 'STUB';
    requiredAction = copyThrough ? 'Replace English copy-through with substantive translation' : 'Review suspiciously short translation';
  } else if (!translation.title || !translation.summary || !translation.body || missingSections.length) {
    overallStatus = 'PARTIAL';
    requiredAction = 'Translate all substantive learner-facing components present in canonical lesson';
  } else if (stale) {
    overallStatus = 'STALE';
    requiredAction = 'Revalidate/retranslate against current canonical lesson';
  }

  rows.push({
    academy: source.track,
    level: source.level,
    lesson_id: id,
    locale,
    canonical_exists: true,
    title_status: titleStatus,
    summary_status: summaryStatus,
    body_status: bodyStatus,
    content_structure_status: structureStatus,
    english_copythrough_status: copyThrough ? 'FAIL' : 'PASS',
    canonical_version_status: canonicalVersionStatus,
    overall_status: overallStatus,
    required_action: requiredAction,
    canonical_fingerprint: source.fingerprint,
    translation_path: translation.path,
  });
}

const generatedAt = new Date().toISOString();
const counts = rows.reduce((acc, row) => {
  acc[row.overall_status] = (acc[row.overall_status] ?? 0) + 1;
  return acc;
}, {});

mkdirSync(dirname(jsonPath), { recursive: true });
writeFileSync(jsonPath, `${JSON.stringify({ generatedAt, counts, rows }, null, 2)}\n`, 'utf8');

const columns = ['academy','level','lesson_id','locale','canonical_exists','title_status','summary_status','body_status','content_structure_status','english_copythrough_status','canonical_version_status','overall_status','required_action'];
const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
writeFileSync(csvPath, `${columns.join(',')}\n${rows.map((row) => columns.map((column) => escapeCsv(row[column])).join(',')).join('\n')}\n`, 'utf8');

const lines = [
  '# Translation Quality Audit',
  '',
  `Generated: ${generatedAt}`,
  '',
  '## Status counts',
  '',
  ...Object.entries(counts).sort().map(([status, count]) => `- ${status}: ${count}`),
  '',
  '## Actionable findings',
  '',
];
for (const row of rows.filter((row) => row.overall_status !== 'COMPLETE').slice(0, 250)) {
  lines.push(`- ${row.lesson_id} [${row.locale}] — ${row.overall_status}: ${row.required_action}`);
}
writeFileSync(mdPath, `${lines.join('\n')}\n`, 'utf8');

console.log(`Translation quality audit: ${rows.length} translation records checked.`);
console.log(`Reports: ${relative(root, jsonPath)}, ${relative(root, csvPath)}, ${relative(root, mdPath)}`);
