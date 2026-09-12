import type { Metadata } from "next";
import Link from "next/link";

import { getPublishedTracks } from "@/lib/curriculum/public-safe";
import { getServerTranslator } from "@/lib/international/server";

export const metadata: Metadata = { title: "Curriculum | Edunancial", description: "Browse the complete Edunancial curriculum." };
export const dynamic = "force-dynamic";
const TRACK_STYLES:Record<string,string>={RED:"border-red-500/30",WHITE:"border-slate-500/30",BLUE:"border-blue-500/30",GREEN:"border-green-500/30",GOLD:"border-yellow-500/30",PURPLE:"border-purple-500/30",ORANGE:"border-orange-500/30",BLACK:"border-slate-400/30"};
export default async function CurriculumIndexPage(){
 const {language,t}=await getServerTranslator(); const academies=await getPublishedTracks(language); const total=academies.reduce((n,a)=>n+a.lessonCount,0);
 return <main className="min-h-screen bg-[#08101f] text-white"><section className="mx-auto max-w-6xl px-6 py-16"><p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">{t("curriculumPage.label")}</p><h1 className="mt-4 text-5xl font-black md:text-7xl">{t("curriculumPage.title")}</h1><p className="mt-6 max-w-3xl text-lg text-slate-300">{t("curriculumPage.intro")}</p>{total>0&&<p className="mt-4 text-sm text-slate-500">{total} lessons available</p>}</section><section className="mx-auto max-w-6xl px-6 pb-20"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{academies.map(a=><Link key={a.code} href={`/curriculum/${a.code.toLowerCase()}`} className={`rounded-2xl border bg-slate-900/50 p-6 transition ${TRACK_STYLES[a.code]??"border-slate-700"}`}><span className="text-xs font-bold tracking-[0.3em] text-slate-400">{a.code}</span><h2 className="mt-3 text-2xl font-black">{a.name}</h2><p className="mt-2 text-sm text-slate-400">{a.description}</p><p className="mt-4 text-sm text-yellow-400">{a.lessonCount>0?`${a.lessonCount} lessons`:t("curriculumPage.comingSoon")}</p></Link>)}</div></section></main>;
}
