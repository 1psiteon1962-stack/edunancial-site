import Link from "next/link";
import { headers } from "next/headers";

import InvestmentGrowthCalculator from "@/components/investing/InvestmentGrowthCalculator";
import { getAdminSession } from "@/lib/admin-content/auth";
import { getAuthenticatedMemberSession } from "@/lib/auth/server";
import { canAccessCurriculumLesson } from "@/lib/curriculum/access";
import { checkLessonAccess } from "@/lib/curriculum/access-gate";
import { getServerLanguage } from "@/lib/international/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Investment Growth Calculator | Edunancial", description: "Educational compound-growth calculator for Edunancial Level 2 members and above." };

export default async function InvestmentGrowthPage() {
  const language = await getServerLanguage();
  const adminSession = await getAdminSession();
  const isAdmin = Boolean(adminSession);
  const memberSession = await getAuthenticatedMemberSession();
  const cookieHeader = (await headers()).get("cookie");
  const cookieAccess = checkLessonAccess(2, 1, cookieHeader, "INVESTMENT-GROWTH-CALCULATOR", language);
  const sessionAccess = memberSession.user ? canAccessCurriculumLesson({ level: 2, lessonNumber: 1, membershipTier: memberSession.user.membershipTier, isAdmin }) : false;
  const allowed = isAdmin || sessionAccess || cookieAccess.allowed;

  if (!allowed) return <main className="min-h-screen bg-[#08101f] text-white"><section className="mx-auto max-w-4xl px-6 py-16"><p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Edunancial interactive tools</p><h1 className="mt-3 text-4xl font-black md:text-5xl">Investment Growth Calculator</h1><p className="mt-4 max-w-2xl text-lg text-slate-300">This applied investing tool is included with Level 2 curriculum access and above.</p><div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/50 p-10 text-center"><div className="text-6xl">🔒</div><h2 className="mt-5 text-2xl font-black">Basic membership or higher required</h2><p className="mx-auto mt-3 max-w-xl text-slate-300">Upgrade to unlock Level 2 applied tools, including customizable contribution, return, time-horizon and compound-growth projections.</p><Link href="/membership" className="mt-6 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400">View membership plans</Link></div></section></main>;

  return <main className="min-h-screen bg-[#08101f] text-white"><section className="mx-auto max-w-6xl px-6 py-14"><nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-400"><Link href="/courses" className="hover:text-white">Courses</Link><span>/</span><span className="text-slate-200">Investment Growth Calculator</span></nav><InvestmentGrowthCalculator /></section></main>;
}
