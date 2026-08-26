"use client";

import { useMemo, useState } from "react";
import { calculateInvestmentGrowth, calculateMilestones, type ContributionFrequency } from "@/lib/investing/compound-growth";

const currencies = ["USD", "CAD", "EUR", "GBP", "DOP", "UGX", "BRL", "JPY"];
const frequencies: Array<[ContributionFrequency, string]> = [["weekly","Weekly"],["biweekly","Every two weeks"],["monthly","Monthly"],["annual","Annually"]];

export default function InvestmentGrowthCalculator() {
  const [startingBalance,setStartingBalance]=useState(0);
  const [contributionAmount,setContributionAmount]=useState(40);
  const [frequency,setFrequency]=useState<ContributionFrequency>("weekly");
  const [annualReturn,setAnnualReturn]=useState(8);
  const [years,setYears]=useState(40);
  const [currency,setCurrency]=useState("USD");
  const result=useMemo(()=>calculateInvestmentGrowth({startingBalance,contributionAmount,contributionFrequency:frequency,annualReturnPercent:annualReturn,years}),[startingBalance,contributionAmount,frequency,annualReturn,years]);
  const milestones=useMemo(()=>calculateMilestones({startingBalance,contributionAmount,contributionFrequency:frequency,annualReturnPercent:annualReturn}),[startingBalance,contributionAmount,frequency,annualReturn]);
  const format=(value:number)=>new Intl.NumberFormat(undefined,{style:"currency",currency,maximumFractionDigits:0}).format(value);
  const reset=()=>{setStartingBalance(0);setContributionAmount(40);setFrequency("weekly");setAnnualReturn(8);setYears(40);setCurrency("USD");};
  const visibleYears=years<=12?result.yearly:result.yearly.filter(row=>row.year===1||row.year%5===0||row.year===years);

  return <section className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 sm:p-8">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Level 2+ interactive tool</p><h2 className="mt-2 text-2xl font-black">Investment Growth Calculator</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Start with Edunancial&apos;s $40-per-week example or replace every assumption with your own investment numbers. This is an educational projection, not a guaranteed return.</p></div><button type="button" onClick={reset} className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold">Reset to $40/week example</button></div>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <label className="text-sm text-slate-300">Starting balance<input type="number" min="0" value={startingBalance} onChange={e=>setStartingBalance(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2"/></label>
      <label className="text-sm text-slate-300">Contribution amount<input type="number" min="0" value={contributionAmount} onChange={e=>setContributionAmount(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2"/></label>
      <label className="text-sm text-slate-300">Contribution frequency<select value={frequency} onChange={e=>setFrequency(e.target.value as ContributionFrequency)} className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2">{frequencies.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm text-slate-300">Expected annual return (%)<input type="number" min="-99" max="100" step="0.1" value={annualReturn} onChange={e=>setAnnualReturn(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2"/></label>
      <label className="text-sm text-slate-300">Years<input type="number" min="1" max="80" value={years} onChange={e=>setYears(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2"/></label>
      <label className="text-sm text-slate-300">Currency<select value={currency} onChange={e=>setCurrency(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2">{currencies.map(value=><option key={value}>{value}</option>)}</select></label>
    </div>
    <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-white/[0.05] p-4"><p className="text-xs text-slate-400">Total contributed</p><p className="mt-1 text-2xl font-black">{format(result.totalContributed)}</p></div><div className="rounded-2xl bg-white/[0.05] p-4"><p className="text-xs text-slate-400">Estimated investment growth</p><p className="mt-1 text-2xl font-black">{format(result.totalGrowth)}</p></div><div className="rounded-2xl bg-emerald-400/10 p-4"><p className="text-xs text-emerald-200">Estimated ending value</p><p className="mt-1 text-2xl font-black text-emerald-300">{format(result.endingBalance)}</p></div></div>
    <h3 className="mt-7 text-lg font-black">10 / 20 / 30 / 40 year comparison</h3><div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{milestones.map(m=><button key={m.year} type="button" onClick={()=>setYears(m.year)} className="rounded-2xl border border-white/10 p-4 text-left hover:bg-white/[0.04]"><p className="text-sm font-bold">{m.year} years</p><p className="mt-1 text-xl font-black">{format(m.endingBalance)}</p><p className="mt-1 text-xs text-slate-400">Contributed {format(m.totalContributed)} · growth {format(m.totalGrowth)}</p></button>)}</div>
    <h3 className="mt-7 text-lg font-black">Year-by-year growth</h3><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead className="text-left text-slate-400"><tr><th className="py-2">Year</th><th>Contributed</th><th>Growth</th><th>Ending value</th></tr></thead><tbody>{visibleYears.map(row=><tr key={row.year} className="border-t border-white/10"><td className="py-2 font-bold">{row.year}</td><td>{format(row.contributed)}</td><td>{format(row.growth)}</td><td className="font-bold">{format(row.endingBalance)}</td></tr>)}</tbody></table></div>
    <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-xs leading-5 text-amber-100"><strong>Educational illustration:</strong> Expected returns are assumptions, not guarantees. Actual results can be affected by market losses, taxes, fees, inflation, contribution timing, account eligibility and contribution limits. An IRA is an account type; its return depends on the investments held inside it.</div>
  </section>;
}
