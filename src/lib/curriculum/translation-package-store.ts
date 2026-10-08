import { Buffer } from "node:buffer";

import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { resolveCurriculumLocale } from "@/lib/curriculum/localization";
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
function safeKey(value:string){return value.trim().replace(/[^A-Za-z0-9._-]+/gu,"_")}
export function translationPackageKey(lessonId:string,locale:string){const m=lessonId.trim().toUpperCase().match(LESSON_COORDINATE);return !m||!locale.trim()?null:`${m[1]}-L${m[2]}-${locale.trim()}`}
function packagePath(key:string){return `${ROOT}/${safeKey(key)}.json`}
async function readJson<T>(path:string):Promise<T|null>{const raw=await getAdminContentStorage().readBinary(path);if(!raw||raw.length===0)return null;try{return JSON.parse(raw.toString("utf8")) as T}catch{return null}}
async function writeJson(path:string,value:unknown){await getAdminContentStorage().saveBinary(path,Buffer.from(`${JSON.stringify(value,null,2)}\n`,"utf8"),"application/json")}
let cache:{at:number;packages:TranslationPackage[]}|null=null;
export function invalidateTranslationPackageCache(){cache=null}
export async function readTranslationPackages():Promise<TranslationPackage[]>{if(cache&&Date.now()-cache.at<CACHE_TTL_MS)return cache.packages;try{const keys=await readJson<string[]>(INDEX_PATH)??[];const packages:TranslationPackage[]=[];for(const key of keys){const entry=await readJson<TranslationPackage>(packagePath(key));if(entry?.lessons&&typeof entry.locale==="string")packages.push(entry)}cache={at:Date.now(),packages};return packages}catch{return cache?.packages??[]}}
export async function readTranslationPackagesForLocale(locale:string):Promise<TranslationPackage[]>{const normalized=resolveCurriculumLocale(locale).trim().toLowerCase();if(!normalized||normalized==="en-us"||normalized==="en")return[];try{const keys=await readJson<string[]>(INDEX_PATH)??[];const matching=keys.filter(key=>key.toLowerCase().endsWith(`-${normalized}`));const entries=await Promise.all(matching.map(key=>readJson<TranslationPackage>(packagePath(key))));return entries.filter((entry):entry is TranslationPackage=>Boolean(entry?.lessons&&typeof entry.locale==="string"&&entry.locale.toLowerCase()===normalized))}catch(error){console.error(`[translation-package-store] locale package read failed for ${normalized}; serving committed/canonical content.`,error);return[]}}
export async function readTranslationPackageForLesson(lessonId:string,locale:string):Promise<TranslationPackage|null>{const normalized=resolveCurriculumLocale(locale);if(normalized==="en-US"||normalized==="en")return null;const key=translationPackageKey(lessonId,normalized);if(!key)return null;try{const entry=await readJson<TranslationPackage>(packagePath(key));return entry?.lessons&&typeof entry.locale==="string"&&entry.locale.toLowerCase()===normalized.toLowerCase()?entry:null}catch(error){console.error(`[translation-package-store] lesson package read failed for ${key}; serving committed/canonical content.`,error);return null}}
export async function publishTranslationPackages(records:TranslationPackageRecord[]):Promise<{written:string[];packageKeys:string[]}>{const groups=new Map<string,TranslationPackageRecord[]>();for(const record of records){const key=translationPackageKey(record.lessonId,record.locale);if(!key)throw new Error(`Cannot derive translation package coordinate for ${record.lessonId}/${record.locale}.`);groups.set(key,[...(groups.get(key)??[]),record])}const written:string[]=[];for(const[key,group]of groups){const[,track,level]=group[0]!.lessonId.trim().toUpperCase().match(LESSON_COORDINATE)!;const existing=await readJson<TranslationPackage>(packagePath(key));const lessons:Record<string,PublishedLessonTranslation>={...(existing?.lessons??{})};for(const record of group){const id=record.lessonId.trim().toUpperCase();const next:PublishedLessonTranslation={...(lessons[id]??{})};if(typeof record.title==="string")next.title=record.title;if(typeof record.summary==="string")next.summary=record.summary;if(typeof record.body==="string")next.body=record.body;lessons[id]=next;written.push(id)}await writeJson(packagePath(key),{key,track:track!,level:Number(level),locale:group[0]!.locale.trim(),updatedAt:new Date().toISOString(),lessons} satisfies TranslationPackage)}const keys=[...groups.keys()];if(keys.length){const indexed=await readJson<string[]>(INDEX_PATH)??[];const merged=[...new Set([...indexed,...keys])].sort();if(merged.length!==indexed.length)await writeJson(INDEX_PATH,merged)}invalidateTranslationPackageCache();return{written:[...new Set(written)].sort(),packageKeys:keys.sort()}}
