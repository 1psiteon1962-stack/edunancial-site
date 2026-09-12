import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isPublicCurriculumTrack } from "@/lib/curriculum/localization";
import { getPublishedTrack } from "@/lib/curriculum/public-safe";
import { translate } from "@/lib/international/i18n";
import { getServerLanguage } from "@/lib/international/server";
export const dynamic="force-dynamic";
interface Props{params:Promise<{track:string}>}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {track:raw}=await params;const language=await getServerLanguage();const track=await getPublishedTrack(raw.toUpperCase(),language);return {title:track?`${track.name} (${track.code}) | Edunancial`:"Track Not Found | Edunancial"};}
const COLORS:Record<string,string>={RED:"text-red-400",WHITE:"text-slate-200",BLUE:"text-blue-400",GREEN:"text-green-400",GOLD:"text-yellow-400",PURPLE:"text-purple-400",ORANGE:"text-orange-400",BLACK:"text-slate-200"};
export default async function TrackPage({params}:Props){const {track:raw}=await params;const code=raw.toUpperCase();if(!isPublicCurriculumTrack(code))notFound();const language=await getServerLanguage();const track=await getPublishedTrack(code,language);if(!track)notFound();const t=(key:string,values?:Record<string,string|number>)=>translate(language,key,values);return <main className="min-h-screen bg-[#08101f] text-white"><section className="mx-auto max-w-5xl px-6 py-16"><nav className="mb-8 text-sm text-slate-400"><Link href="/curriculum">{t("nav.curriculum")}</Link> / {track.name}</nav><h1 className={`text-5xl font-black md:text-6xl ${COLORS[code]??"text-yellow-400"}`}>{track.name}</h1><p className="mt-4 text-slate-300">{track.lessonCount>0?`${track.lessonCount} lessons available`:t("curriculumTrack.emptySummary")}</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{track.levels.map(level=><Link key={level.level} href={`/curriculum/${raw}/l${level.level}`} className="rounded-2xl border border-slate-700 bg-slate-900 p-6"><p className="text-sm text-slate-500">{t("curriculumTrack.levelLabel",{level:level.level})}</p><h2 className="mt-1 text-xl font-black">{track.name} {level.level}</h2><p className="mt-2 text-sm text-slate-400">{level.lessonCount>0?`${level.lessonCount} lessons`:t("curriculumTrack.lessonsComingSoon")}</p></Link>)}</div></section></main>}
