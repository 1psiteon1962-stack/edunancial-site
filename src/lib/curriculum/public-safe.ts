import { ACADEMIES } from "@/lib/curriculum/academies";
import { getLocalizedTrackCopy, resolveCurriculumLocale } from "@/lib/curriculum/localization";
import { getLessonContent, readRegistry, type RegistryAsset } from "@/lib/curriculum/reader";
import { getNormalizedLesson } from "@/lib/curriculum/normalized-reader";
import { CURRICULUM_LEVELS, CURRICULUM_TRACKS, type CurriculumLevel, type CurriculumTrack } from "@/lib/curriculum/contract";
import {
  getPublishedLesson as getRemotePublishedLesson,
  getPublishedTrack as getRemotePublishedTrack,
  getPublishedTracks as getRemotePublishedTracks,
  type PublishedLessonRecord,
} from "@/lib/curriculum/authoritative-published";

function registryLesson(asset: RegistryAsset, locale: string): PublishedLessonRecord | null {
  if (asset.type !== "lesson" || asset.status !== "active" || typeof asset.lessonNumber !== "number") return null;
  const content = getLessonContent(asset.id, locale) ?? getLessonContent(asset.id, "en");
  return {
    id: asset.id, track: asset.track, trackName: asset.trackName, level: asset.level,
    lessonNumber: asset.lessonNumber, title: content?.meta.title ?? asset.title,
    summary: content?.meta.summary ?? asset.metadata?.summary ?? "", author: content?.meta.author ?? asset.author,
    date: content?.meta.date ?? asset.date, version: content?.meta.version ?? asset.version, status: "active",
    importedAt: content?.meta.importedAt ?? asset.importedAt, metadata: asset.metadata ?? {}, path: asset.path,
    body: content?.body ?? "", frontMatter: content?.frontMatter ?? {},
  };
}

function bundledTracks(languageOrLocale: string) {
  const locale = resolveCurriculumLocale(languageOrLocale);
  const registry = readRegistry();
  return ACADEMIES.map((academy) => {
    const localized = getLocalizedTrackCopy(academy.code, locale);
    const registryTrack = registry.tracks[academy.code];
    const levels = Array.from({ length: academy.levelCount }, (_, index) => index + 1).map((level) => {
      const assets = registryTrack?.levels?.[String(level)]?.assets ?? registryTrack?.levels?.[level as unknown as keyof typeof registryTrack.levels]?.assets ?? {};
      const lessons = Object.values(assets).map((asset) => registryLesson(asset, locale)).filter((lesson): lesson is PublishedLessonRecord => Boolean(lesson)).sort((a,b)=>a.lessonNumber-b.lessonNumber||a.id.localeCompare(b.id));
      return { level, lessonCount: lessons.length, lessons };
    });
    return { code: academy.code, name: localized?.name ?? academy.name, description: localized?.description ?? academy.description, levelCount: academy.levelCount, lessonCount: levels.reduce((sum,l)=>sum+l.lessonCount,0), levels };
  });
}

type Track = ReturnType<typeof bundledTracks>[number];
function mergeTrack(remote: Track | undefined, bundled: Track): Track {
  if (!remote) return bundled;
  const levels = Array.from({length: Math.max(remote.levelCount,bundled.levelCount)},(_,i)=>i+1).map(level=>{
    const r=remote.levels.find(l=>l.level===level)?.lessons ?? [];
    const b=bundled.levels.find(l=>l.level===level)?.lessons ?? [];
    const byId=new Map<string,PublishedLessonRecord>();
    for(const lesson of b) byId.set(lesson.id.toUpperCase(),lesson);
    for(const lesson of r) byId.set(lesson.id.toUpperCase(),lesson);
    const lessons=[...byId.values()].sort((a,b)=>a.lessonNumber-b.lessonNumber||a.id.localeCompare(b.id));
    return {level,lessonCount:lessons.length,lessons};
  });
  return {...bundled,...remote,levelCount:levels.length,lessonCount:levels.reduce((sum,l)=>sum+l.lessonCount,0),levels};
}

export async function getPublishedTracks(languageOrLocale: string) {
  const bundled=bundledTracks(languageOrLocale);
  try {
    const remote=await getRemotePublishedTracks(languageOrLocale);
    return bundled.map(b=>mergeTrack(remote.find(r=>r.code===b.code) as Track|undefined,b));
  } catch { return bundled; }
}

export async function getPublishedTrack(code: string, languageOrLocale: string) {
  const bundled=bundledTracks(languageOrLocale).find(t=>t.code===code.toUpperCase());
  if(!bundled) return null;
  try { return mergeTrack(await getRemotePublishedTrack(code,languageOrLocale) as Track|undefined,bundled); }
  catch { return bundled; }
}

function normalizedLessonRecord(id: string, languageOrLocale: string): PublishedLessonRecord | null {
  const match=id.trim().toUpperCase().match(/^([A-Z]+)-L([1-5])-(\\d{3})$/u);
  if(!match) return null;
  const track=match[1] as CurriculumTrack, level=Number(match[2]) as CurriculumLevel, lessonNumber=Number(match[3]);
  if(!CURRICULUM_TRACKS.includes(track)||!CURRICULUM_LEVELS.includes(level)) return null;
  const row=getNormalizedLesson(track,level,lessonNumber,languageOrLocale);
  if(!row) return null;
  const academy=ACADEMIES.find(a=>a.code===track);
  return {id:row.id,track,trackName:academy?.name??track,level,lessonNumber:row.lesson,title:row.title,summary:row.summary,author:"Waldemar M. Caban",date:"",version:"1.0",status:"active",importedAt:"",metadata:{qualityStatus:row.status,sourceHash:row.sourceHash,origin:row.origin},path:row.origin,body:row.body,frontMatter:{}};
}

export async function getPublishedLesson(id: string, languageOrLocale: string) {
  try { const remote=await getRemotePublishedLesson(id,languageOrLocale); if(remote)return remote; } catch {}
  const normalized=id.toUpperCase();
  for(const track of bundledTracks(languageOrLocale)) for(const level of track.levels){const lesson=level.lessons.find(c=>c.id.toUpperCase()===normalized);if(lesson)return lesson;}
  // Universal compiled index is the final safe fallback. This exposes L4/L5
  // through the same contract without changing the proven L1-L3 precedence.
  return normalizedLessonRecord(normalized,languageOrLocale);
}
