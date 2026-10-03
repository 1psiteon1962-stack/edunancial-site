import Link from "next/link";
import { requireOwnerPageSession } from "@/lib/admin-content/auth";
import { getMarketingOverview } from "@/lib/marketing/control-plane";

export const dynamic="force-dynamic";

export default async function MarketingControlPage(){
 await requireOwnerPageSession();
 let overview:Awaited<ReturnType<typeof getMarketingOverview>>|null=null; let error="";
 try{overview=await getMarketingOverview();}catch(e){error=e instanceof Error?e.message:"Marketing database unavailable.";}
 const cards=overview?[["Active campaigns",overview.campaigns],["Needs review",overview.review],["Approved",overview.approved],["Scheduled",overview.scheduled],["Published",overview.published],["Failed",overview.failed]]:[];
 return <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white"><div className="mx-auto max-w-7xl">
  <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-black uppercase tracking-[.3em] text-blue-300">Marketing automation</p><h1 className="mt-2 text-4xl font-black">Marketing Control Plane</h1><p className="mt-3 max-w-3xl text-slate-300">AI creates and adapts. Nothing publishes until approved and scheduled. Connected providers execute only approved work.</p></div><Link href="/admin/dashboard" className="rounded-xl border border-white/15 px-4 py-2">Command Center</Link></div>
  {error?<p className="mt-8 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">{error}</p>:null}
  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">{cards.map(([label,value])=><div key={String(label)} className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>)}</div>
  <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"><h2 className="text-2xl font-black">Approval inbox</h2><p className="mt-2 text-sm text-slate-400">Review, approved, scheduled and failed publications. Write controls are API-protected and owner-only.</p>
  <div className="mt-5 space-y-3">{overview?.pending.length?overview.pending.map(item=><article key={item.id} className="rounded-xl bg-black/20 p-4"><div className="flex flex-wrap gap-3 text-xs font-bold uppercase text-blue-300"><span>{item.status}</span><span>{item.platform}</span><span>{item.locale}</span><span>{item.campaign}</span></div><p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">{item.copy}</p>{item.scheduledFor?<p className="mt-2 text-xs text-slate-500">Scheduled {item.scheduledFor}</p>:null}</article>):<p className="py-8 text-slate-400">No marketing publications are waiting.</p>}</div>
  </section>
 </div></main>;
}
