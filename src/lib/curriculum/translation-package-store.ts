
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { resolveCurriculumLocale } from "@/lib/curriculum/localization";
import { normalizeLanguageCode } from "@/lib/international/languages";
import { updateJsonCas } from "@/lib/admin-content/storage/cas-json";
import type { PublishedLessonTranslation } from "@/lib/curriculum/authoritative-published";

const ROOT = "published/atomic/translation-packages";
const INDEX_PATH = `${ROOT}/index.json`;
const CACHE_TTL_MS = 30_000;

export type TranslationPackage = {
  key: string; track: string; level: number; locale: string; updatedAt: string;
  lessons: Record<string, PublishedLessonTranslation>;
};
export type TranslationPackageRecord = { lessonId: string; locale: string; title?: string; summary?: string; body?: string };
const LESSON_COORDINATE = /^([A-Z]+)-L([1-9]\d*)-\d{3}$/u;
/**
 * One locale spelling per catalog language. Uploads arrived as "it-IT", "it",
 * "es-caribbean", "es-Caribbean"... and blob keys are case-sensitive, so the
 * same package could be found by track discovery but not by lesson retrieval.
 */
export function canonicalPackageLocale(locale:string){return normalizeLanguageCode(locale)}
function localeVariants(locale:string){const raw=locale.trim(),resolved=resolveCurriculumLocale(raw),canonical=canonicalPackageLocale(raw);return [...new Set([canonical,resolved,raw,raw.toLowerCase(),resolved.toLowerCase()].filter(Boolean))]}
export function sameLocale(a:string,b:string){const x=canonicalPackageLocale(a),y=canonicalPackageLocale(b);if(x!==y)return false;/* unknown codes normalize to the default; never let two unknowns (or an unknown and English) match */if(x==="en-US")return /^en(?:[-_]|$)/iu.test(a.trim())&&/^en(?:[-_]|$)/iu.test(b.trim());return true}
function safeKey(value:string){return value.trim().replace(/[^A-Za-z0-9._-]+/gu,"_")}
export function translationPackageKey(lessonId:string,locale:string){const m=lessonId.trim().toUpperCase().match(LESSON_COORDINATE);return !m||!locale.trim()?null:`${m[1]}-L${m[2]}-${canonicalPackageLocale(locale)}`}
function legacyPackageKeys(lessonId:string,locale:string){const m=lessonId.trim().toUpperCase().match(LESSON_COORDINATE);return !m?[]:localeVariants(locale).map(v=>`${m[1]}-L${m[2]}-${v}`)}
function packagePath(key:string){return `${ROOT}/${safeKey(key)}.json`}
async function readJson<T>(path:string):Promise<T|null>{const raw=await getAdminContentStorage().readBinary(path);if(!raw||raw.length===0)return null;try{return JSON.parse(raw.toString("utf8")) as T}catch{return null}}
let cache:{at:number;packages:TranslationPackage[]}|null=null;
export function invalidateTranslationPackageCache(){cache=null}
export async function readTranslationPackages():Promise<TranslationPackage[]>{if(cache&&Date.now()-cache.at<CACHE_TTL_MS)return cache.packages;try{const keys=await readJson<string[]>(INDEX_PATH)??[];const packages:TranslationPackage[]=[];for(const key of keys){const entry=await readJson<TranslationPackage>(packagePath(key));if(entry?.lessons&&typeof entry.locale==="string")packages.push(entry)}cache={at:Date.now(),packages};return packages}catch{return cache?.packages??[]}}
export async function readTranslationPackagesForLocale(locale:string):Promise<TranslationPackage[]>{const normalized=resolveCurriculumLocale(locale).trim().toLowerCase();if(!normalized||normalized==="en-us"||normalized==="en")return[];try{const keys=await readJson<string[]>(INDEX_PATH)??[];const matching=keys.filter(key=>{const m=key.match(/^[A-Z]+-L\d+-(.+)$/u);return Boolean(m&&sameLocale(m[1]!,locale))});const entries=await Promise.all(matching.map(key=>readJson<TranslationPackage>(packagePath(key))));return entries.filter((entry):entry is TranslationPackage=>Boolean(entry?.lessons&&typeof entry.locale==="string"&&sameLocale(entry.locale,locale)))}catch(error){console.error(`[translation-package-store] locale package read failed for ${normalized}; serving committed/canonical content.`,error);return[]}}
export async function readTranslationPackageForLesson(lessonId:string,locale:string):Promise<TranslationPackage|null>{const normalized=resolveCurriculumLocale(locale);if(normalized==="en-US"||normalized==="en")return null;const keys=legacyPackageKeys(lessonId,normalized);if(!keys.length)return null;try{for(const key of keys){const entry=await readJson<TranslationPackage>(packagePath(key));if(entry?.lessons&&typeof entry.locale==="string"&&sameLocale(entry.locale,normalized)&&entry.lessons[lessonId.trim().toUpperCase()])return entry}return null}catch(error){console.error(`[translation-package-store] lesson package read failed for ${keys[0]}; serving committed/canonical content.`,error);return null}}
export async function publishTranslationPackages(records:TranslationPackageRecord[]):Promise<{written:string[];packageKeys:string[]}>{const groups=new Map<string,TranslationPackageRecord[]>();for(const record of records){const key=translationPackageKey(record.lessonId,record.locale);if(!key)throw new Error(`Cannot derive translation package coordinate for ${record.lessonId}/${record.locale}.`);groups.set(key,[...(groups.get(key)??[]),record])}const written:string[]=[];for(const[key,group]of groups){const[,track,level]=group[0]!.lessonId.trim().toUpperCase().match(LESSON_COORDINATE)!;const updated=await updateJsonCas<TranslationPackage>(packagePath(key),(existing)=>{const lessons:Record<string,PublishedLessonTranslation>={...(existing?.lessons??{})};for(const record of group){const id=record.lessonId.trim().toUpperCase();const next:PublishedLessonTranslation={...(lessons[id]??{})};if(typeof record.title==="string")next.title=record.title;if(typeof record.summary==="string")next.summary=record.summary;if(typeof record.body==="string")next.body=record.body;lessons[id]=next}return{key,track:track!,level:Number(level),locale:canonicalPackageLocale(group[0]!.locale),updatedAt:new Date().toISOString(),lessons}},`Publish translation package ${key}`);if(!updated)throw new Error(`Translation package ${key} compare-and-swap exhausted retries.`);for(const record of group)written.push(record.lessonId.trim().toUpperCase())}const keys=[...groups.keys()];if(keys.length){const merged=await updateJsonCas<string[]>(INDEX_PATH,(indexed)=>{const current=indexed??[];const next=[...new Set([...current,...keys])].sort();return next},"Update translation package index");if(!merged)throw new Error("Translation package index compare-and-swap exhausted retries.")}invalidateTranslationPackageCache();return{written:[...new Set(written)].sort(),packageKeys:keys.sort()}}
