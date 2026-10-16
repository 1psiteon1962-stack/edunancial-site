#!/usr/bin/env node
/**
 * Read-only, conservative Git working-tree inventory. This never queries or
 * changes Netlify Blob, databases, content files, production records, or Git.
 * A lesson not found in this inventory is NOT proof of production absence.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';

const TRACKS = ['RED', 'WHITE', 'BLUE', 'GREEN', 'GOLD', 'PURPLE', 'ORANGE', 'BLACK'];
const ROOTS = ['content/curriculum', 'content/courses', 'curriculum/seeds/translations'];
const FILE_ID_RE = /(?:^|[^A-Za-z0-9])(RED|WHITE|BLUE|GREEN|GOLD|PURPLE|ORANGE|BLACK)-L([1-5])-(\d{3})(?:([._-])([A-Za-z]{2}(?:[-_][A-Za-z0-9]+)*))?\.(md|json)$/i;
const STRICT_ID_RE = /^(RED|WHITE|BLUE|GREEN|GOLD|PURPLE|ORANGE|BLACK)-L([1-5])-(\d{3})$/;
const POSSIBLE_LOCALE_RE = /^[a-z]{2}(?:[-_](?:[a-z]{2}|419|Caribbean))?$/i;
const SUPPORTED = new Set(['en-US','en-GB','es-419','es-Caribbean','es-ES','fr-CA','fr-FR','pt-BR','pt-PT','de','it','nl','ht']);
const files = [];
const diagnostics = { ambiguous: [], outOfRange: [], invalidJson: [], duplicates: [], unclassifiedMarkdown: [], incompleteTranslations: [], seedRecordsIgnoredByLearner: [] };
const diagnosticCounts = Object.fromEntries(Object.keys(diagnostics).map(key=>[key,0]));
let diagnosticTruncated = 0;
function note(type, detail) {
  diagnosticCounts[type]++;
  if (diagnostics[type].length < 50) diagnostics[type].push(detail);
  else diagnosticTruncated++;
}
function walk(dir) {
  if (!existsSync(dir)) return;
  for (const ent of readdirSync(dir, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name))) {
    const path = join(dir, ent.name);
    if (ent.isDirectory()) walk(path);
    else if (ent.isFile() && /\.(md|json)$/i.test(ent.name)) files.push(path);
  }
}
ROOTS.forEach(walk);

function normalizeLocale(candidate) {
  if (!candidate || !POSSIBLE_LOCALE_RE.test(candidate)) return null;
  const parts = candidate.replace(/_/g,'-').split('-');
  const lang = parts[0].toLowerCase();
  if (parts.length === 1) return lang;
  const region = parts.slice(1).join('-').toLowerCase();
  if (region === 'caribbean') return lang + '-Caribbean';
  if (region === '419') return lang + '-419';
  return lang + '-' + region.toUpperCase();
}
function directoryLocale(path) {
  const segments = dirname(path).replace(/\\/g,'/').split('/');
  // Examine only subdirectories within the two tracked trees. Track names and
  // level directories cannot accidentally be interpreted as locale names.
  const candidates = segments.filter(seg => POSSIBLE_LOCALE_RE.test(seg) &&
    !TRACKS.includes(seg.toUpperCase()) && !/^L[1-5]$/i.test(seg));
  return candidates.length ? normalizeLocale(candidates.at(-1)) : null;
}
function markdownLocale(path) {
  const source = readFileSync(path, 'utf8');
  const fm = source.startsWith('---\n') ? source.slice(4, Math.max(4, source.indexOf('\n---', 4))) : '';
  const m = fm.match(/^locale:\s*["']?([A-Za-z]{2}(?:[-_][A-Za-z0-9]+)*)/m);
  return m ? normalizeLocale(m[1]) : null;
}
function idFromPath(path) {
  const m = basename(path).match(FILE_ID_RE);
  if (!m) return null;
  const id = `${m[1].toUpperCase()}-L${m[2]}-${m[3]}`;
  const suffixLocale = normalizeLocale(m[5]);
  if (m[5] && m[4] !== '.' && !SUPPORTED.has(suffixLocale)) return { id, unclassifiedSuffix:m[5] };
  return { id, track:m[1].toUpperCase(), level:Number(m[2]), suffixLocale, extension:m[6].toLowerCase() };
}
function validId(id, path) {
  const match = String(id).toUpperCase().match(STRICT_ID_RE);
  if (!match) return null;
  const number = Number(match[3]);
  if (number < 1 || number > 50) {
    note('outOfRange', { id:String(id).toUpperCase(), path });
    return null;
  }
  return { id: String(id).toUpperCase(), track: match[1], level: Number(match[2]) };
}
function chosenLocale(candidates, path) {
  const available = candidates.filter(Boolean);
  const distinct = [...new Set(available)];
  if (distinct.length > 1) {
    note('ambiguous', { path, candidates:distinct });
    return null;
  }
  return distinct[0] ?? 'en';
}

const matrix = new Map();
for (const track of TRACKS) for (let level=1;level<=5;level++)
  matrix.set(`${track}-L${level}`, { track, level, englishIds:new Set(), translations:new Map(), paths:new Map() });
function add(idInfo, locale, path) {
  const row=matrix.get(`${idInfo.track}-L${idInfo.level}`);
  const unique = `${idInfo.id}:${locale}`;
  if (row.paths.has(unique) && row.paths.get(unique) !== path)
    note('duplicates', {id:idInfo.id,locale,paths:[row.paths.get(unique),path]});
  else row.paths.set(unique,path);
  if (locale === 'en' || locale === 'en-US') row.englishIds.add(idInfo.id);
  else {
    if (!row.translations.has(locale)) row.translations.set(locale,new Set());
    row.translations.get(locale).add(idInfo.id);
  }
}
function nonEmptyText(value) { return typeof value==='string' && !!value.trim(); }
function hasTranslatedContent(obj) {
  return obj && typeof obj==='object' && nonEmptyText(obj.title) &&
    (nonEmptyText(obj.body) || nonEmptyText(obj.content) || nonEmptyText(obj.markdown));
}
for (const path of files) {
  const location=relative('.',path).replace(/\\/g,'/');
  const filenameId=idFromPath(path);
  if (path.toLowerCase().endsWith('.md')) {
    if (!filenameId || filenameId.unclassifiedSuffix) {
      // Keep a bounded diagnostic: uncertain filenames are not counted as English.
      if (/(RED|WHITE|BLUE|GREEN|GOLD|PURPLE|ORANGE|BLACK)[-_]L[1-5]/i.test(location))
        note('unclassifiedMarkdown', location);
      continue;
    }
    const info=validId(filenameId.id,location);
    if (!info) continue;
    const locale=chosenLocale([
      filenameId.suffixLocale,
      directoryLocale(path),
      markdownLocale(path),
    ],location);
    if (locale) add(info,locale,location);
    continue;
  }
  let obj;
  try { obj=JSON.parse(readFileSync(path,'utf8')); }
  catch(e) { note('invalidJson',{path:location,error:String(e).slice(0,160)}); continue; }
  if (Array.isArray(obj)) {
    // Existing learner resolver reads array-based translation seeds from
    // curriculum/seeds/translations. Include these committed artifacts in
    // the Git-only inventory, without assuming they are live in production.
    for (let index = 0; index < obj.length; index++) {
      const record = obj[index];
      if (!record || typeof record !== 'object' || Array.isArray(record)) continue;
      const coordinate = `${location}#${index}`;
      const info = validId(record.lessonId ?? record.lesson_id ?? record.id ?? '', coordinate);
      if (info && location.startsWith('curriculum/seeds/translations/')) {
        const nested = location.slice('curriculum/seeds/translations/'.length).includes('/');
        if (nested || typeof record.lessonId !== 'string') note('seedRecordsIgnoredByLearner',{id:info.id,path:coordinate,reason:nested?'nested seed file':'no lessonId key'});
      }
      if (!info || !record.locale) continue;
      const locale = chosenLocale([normalizeLocale(String(record.locale))], coordinate);
      if (!locale) {
        note('ambiguous', { path: coordinate, candidates:[String(record.locale)] });
        continue;
      }
      if (hasTranslatedContent(record)) add(info, locale, coordinate);
      else note('incompleteTranslations', {id:info.id, locale, path:coordinate});
    }
    continue;
  }
  if (!obj || typeof obj !== 'object') continue;
  const info=validId(obj.id ?? obj.lesson_id ?? obj.lessonId ?? filenameId?.id ?? '', location);
  if (!info) continue;
  if (obj.translations && typeof obj.translations==='object' && !Array.isArray(obj.translations)) {
    for (const [rawLocale, val] of Object.entries(obj.translations)) {
      const locale=normalizeLocale(rawLocale);
      if (locale && hasTranslatedContent(val)) add(info,locale,location);
      else note('incompleteTranslations',{id:info.id,locale:rawLocale,path:location});
    }
  }
  if (obj.locale && hasTranslatedContent(obj)) {
    const locale=chosenLocale([normalizeLocale(String(obj.locale)),filenameId?.suffixLocale,directoryLocale(path)],location);
    if (locale) add(info,locale,location);
  }
}
const rows=[...matrix.values()].map(row=>{
  const expected=Array.from({length:50},(_,i)=>`${row.track}-L${row.level}-${String(i+1).padStart(3,'0')}`);
  const translations=Object.fromEntries([...row.translations.entries()]
    .sort(([a],[b])=>a.localeCompare(b))
    .map(([locale,ids])=>[locale,{found:ids.size,missingFromGit:expected.filter(id=>!ids.has(id))}]));
  return { track:row.track, level:row.level, englishFoundInGit:row.englishIds.size,
    englishMissingFromGit:expected.filter(id=>!row.englishIds.has(id)), translations };
});
const summary={
  purpose:'Read-only Git inventory. Missing means NOT FOUND IN GIT, not missing in Netlify Blob or production.',
  scannedFiles:files.length, rows, diagnostics, diagnosticCounts, diagnosticTruncated,
};
console.log(JSON.stringify(summary,null,2));
