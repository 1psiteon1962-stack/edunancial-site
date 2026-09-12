"use client";

import Link from "next/link";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { getHomeMarketingCopy } from "@/lib/international/home-marketing-copy";
import { getHomeUiCopy } from "@/lib/international/home-ui-copy";

const goals=["business","realEstate","retirement","finances","career","family"] as const;
const trackPhotos=[
 "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=85",
 "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=85",
 "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=85",
 "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=85",
 "https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=600&q=85",
 "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=85",
 "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=85",
 "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=85"
];
const trackColors=["#dc2626","#e5e7eb","#2563eb","#16a34a","#d4a017","#7e22ce","#ea580c","#111827"];
const goalPhotos=[
 "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=85",
 "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=85",
 "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=700&q=85",
 "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=85",
 "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85",
 "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=700&q=85"
];
const featureIcons=[
 <svg key="learn" viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 16 24 6l20 10-20 10L4 16Z"/><path d="M11 20v12c7 6 19 6 26 0V20"/></svg>,
 <svg key="pace" viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="7" y="8" width="34" height="25" rx="2"/><path d="M3 39h42M17 33l-2 6m16-6 2 6"/></svg>,
 <svg key="global" viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="24" cy="24" r="19"/><path d="M5 24h38M24 5c6 6 9 12 9 19s-3 13-9 19c-6-6-9-12-9-19s3-13 9-19Z"/></svg>,
 <svg key="growth" viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 42h39M9 42V30h8v12m5 0V22h8v20m5 0V10h8v32"/></svg>
];

export default function HomePageClient(){
 const {effectiveLanguage}=useInternationalPreferences();
 const copy=getHomeMarketingCopy(effectiveLanguage); const ui=getHomeUiCopy(effectiveLanguage);
 return <main className="bg-white text-[#061a36]">
  <section className="relative isolate min-h-[355px] overflow-hidden bg-[#07345b] text-white lg:min-h-[385px]">
   <img src="/approved-home-hero.svg" alt="" className="absolute inset-0 h-full w-full object-cover object-center brightness-110 saturate-125"/>
   <div className="absolute inset-0 bg-gradient-to-r from-[#06233f]/90 via-[#06233f]/35 to-transparent"/>
   <div className="relative mx-auto flex min-h-[355px] max-w-[1440px] items-center px-5 py-7 sm:px-8 lg:min-h-[385px] lg:px-16">
    <div className="max-w-[570px]"><h1 className="text-[38px] font-black leading-[.96] tracking-[-.035em] sm:text-[50px] lg:text-[54px]">{copy.heroTitle}</h1><p className="mt-3 max-w-[510px] text-[15px] font-medium leading-6 sm:text-base">{copy.heroBody}</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/curriculum" className="rounded-md bg-[#ffd52a] px-8 py-3 text-[14px] font-black text-[#061a36] shadow">{copy.startFree}</Link><Link href="/assessment" className="rounded-md border border-white bg-[#061a36]/55 px-8 py-3 text-[14px] font-bold text-white">{copy.takeAssessment}</Link></div><div className="mt-4 text-[9px] font-black uppercase tracking-[.07em] text-white/95">KNOWLEDGE &nbsp; | &nbsp; CONFIDENCE &nbsp; | &nbsp; OPPORTUNITY &nbsp; | &nbsp; A BRIGHTER TOMORROW</div></div>
    <div className="absolute bottom-16 right-5 hidden w-[145px] text-[18px] font-black leading-[1.15] lg:block">Financial<br/>literacy to<br/>financial<br/>intelligence.<div className="mt-3 h-[3px] w-12 bg-sky-400"/></div>
   </div>
  </section>
  <section className="border-b border-slate-200 bg-white"><div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">{ui.features.map(([title,body],i)=><div key={title} className="flex min-h-[82px] items-center gap-4 border-r border-slate-200 px-5 py-3"><span className="shrink-0 text-[#0797e8]">{featureIcons[i]}</span><div><h2 className="text-[13px] font-black leading-4">{title}</h2><p className="mt-1 text-[11px] leading-4 text-slate-600">{body}</p></div></div>)}</div></section>
  <section className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-16"><div className="flex items-end justify-between gap-4"><div><h2 className="text-[25px] font-black tracking-[-.02em]">{copy.colorTitle}</h2><p className="text-[13px] text-slate-600">{copy.colorLabel}</p></div><Link href="/curriculum" className="shrink-0 text-[13px] font-bold text-[#0797e8]">{copy.explorePathway} →</Link></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">{copy.tracks.map((track,i)=><Link href={track.href} key={track.code} className="group relative min-h-[154px] overflow-hidden rounded-md border-[4px] bg-[#071426] shadow-md" style={{borderColor:trackColors[i]}}><img src={trackPhotos[i]} alt="" className="absolute inset-0 h-full w-full object-cover brightness-110 saturate-125 transition group-hover:scale-105"/><div className="absolute inset-0 opacity-20 mix-blend-color" style={{backgroundColor:trackColors[i]}}/><div className="absolute inset-x-0 bottom-0 min-h-[78px] bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 pt-7"><h3 className="text-[14px] font-black leading-4 text-white">{track.title}</h3><p className="mt-1 line-clamp-2 text-[10px] leading-[13px] text-white/90">{track.body}</p></div></Link>)}</div></section>
  <section className="bg-gradient-to-b from-[#eaf7ff] to-white"><div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-16"><div className="text-center"><h2 className="text-[27px] font-black tracking-[-.02em]">{ui.goalsTitle}</h2><p className="text-[13px] text-slate-600">{ui.goalsBody}</p></div><div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">{goals.map((goal,i)=>{const [title,body]=ui.goals[goal];return <Link href={`/assessment?goal=${goal}`} key={goal} className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"><div className="h-[74px] overflow-hidden"><img src={goalPhotos[i]} alt="" className="h-full w-full object-cover brightness-105 saturate-110 transition group-hover:scale-105"/></div><div className="p-3"><div className="flex justify-between gap-2"><h3 className="text-[12px] font-black leading-4">{title}</h3><span className="font-black">›</span></div><p className="mt-1 text-[10px] leading-[13px] text-slate-600">{body}</p></div></Link>})}</div><div className="mt-3 flex items-center justify-between gap-4 rounded-md bg-[#d7f0ff] px-6 py-3"><div><h3 className="text-[15px] font-black">{copy.assessmentLabel}</h3><p className="text-[11px] text-slate-600">{copy.assessmentBody}</p></div><Link href="/assessment" className="shrink-0 rounded-md bg-[#0797e8] px-8 py-3 text-[12px] font-bold text-white shadow">{copy.assessmentCta}</Link></div></div></section>
 </main>;
}
