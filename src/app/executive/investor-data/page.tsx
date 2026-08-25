import Link from "next/link";

import { requireOwnerPageSession } from "@/lib/admin-content/auth";
import { getInvestorDataSnapshot } from "@/lib/executive/investor-data";

export const metadata = { title: "Investor Intelligence | Edunancial" };
export const dynamic = "force-dynamic";

const money = (value: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD", maximumFractionDigits: 2 }).format(value);

export default async function InvestorDataPage() {
  await requireOwnerPageSession();
  const snap = await getInvestorDataSnapshot();
  const totalUsers = snap.demographics.reduce((sum, row) => sum + row.users, 0);
  const usdRevenue = snap.revenueByCurrency.reduce((sum, row) => sum + row.revenueUsd, 0);
  const missingFx = snap.revenueByCurrency.reduce((sum, row) => sum + row.missingFxTransactions, 0);
  const taxDue = snap.taxLiabilities.reduce((sum, row) => sum + row.amountDue, 0);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">Executive Intelligence</p>
          <h1 className="mt-2 text-4xl font-black">Investor, Growth & Tax Data</h1>
          <p className="mt-2 max-w-4xl text-sm text-slate-400">Live database rollups for diligence, market segmentation, advancement, currency-normalized revenue, forecast evidence and tax control. Empty sources remain empty rather than being replaced with invented values.</p>
        </div>
        <Link href="/executive/dashboard" className="rounded-lg border border-yellow-500/40 px-4 py-2 text-sm font-semibold text-yellow-400">← Executive Dashboard</Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[['Profiled users', totalUsers.toLocaleString()], ['Revenue normalized to USD', money(usdRevenue, 'USD')], ['Transactions missing FX', missingFx.toLocaleString()], ['Tax ledger amount due', money(taxDue, 'USD')]].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5"><p className="text-xs uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>
        ))}
      </section>

      <section className="mt-10"><h2 className="text-xl font-bold">Revenue by currency</h2><div className="mt-3 overflow-x-auto rounded-xl border border-slate-700"><table className="w-full text-sm"><thead className="bg-slate-900 text-left text-slate-400"><tr><th className="p-3">Currency</th><th className="p-3">Transactions</th><th className="p-3">Original revenue</th><th className="p-3">USD revenue</th><th className="p-3">Missing FX</th></tr></thead><tbody>{snap.revenueByCurrency.map((row) => <tr key={row.currency} className="border-t border-slate-800"><td className="p-3 font-bold">{row.currency}</td><td className="p-3">{row.completedTransactions}</td><td className="p-3">{money(row.revenueOriginalCurrency, row.currency)}</td><td className="p-3">{money(row.revenueUsd, 'USD')}</td><td className="p-3">{row.missingFxTransactions}</td></tr>)}</tbody></table></div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">Demographic rollup</h2><div className="mt-3 overflow-x-auto rounded-xl border border-slate-700"><table className="w-full text-sm"><thead className="bg-slate-900 text-left text-slate-400"><tr><th className="p-3">Country</th><th className="p-3">Region</th><th className="p-3">Age band</th><th className="p-3">Gender</th><th className="p-3">Users</th></tr></thead><tbody>{snap.demographics.slice(0, 100).map((row, index) => <tr key={`${row.country}-${row.region}-${row.ageBand}-${row.gender}-${index}`} className="border-t border-slate-800"><td className="p-3">{row.country}</td><td className="p-3">{row.region}</td><td className="p-3">{row.ageBand}</td><td className="p-3">{row.gender}</td><td className="p-3 font-bold">{row.users}</td></tr>)}</tbody></table></div></section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2"><div><h2 className="text-xl font-bold">Level advancement</h2><div className="mt-3 rounded-xl border border-slate-700 p-4">{snap.levelAdvancements.slice(0, 50).map((row) => <div key={`${row.trackCode}-${row.toLevel}`} className="flex justify-between border-b border-slate-800 py-2 last:border-0"><span>{row.trackCode} → {row.toLevel}</span><strong>{row.advancements}</strong></div>)}</div></div><div><h2 className="text-xl font-bold">Growth forecasts</h2><div className="mt-3 rounded-xl border border-slate-700 p-4">{snap.growthForecasts.slice(0, 30).map((row, index) => <div key={`${row.dimensionType}-${row.dimensionValue}-${row.horizonDays}-${index}`} className="border-b border-slate-800 py-3 last:border-0"><div className="flex justify-between gap-4"><strong>{row.dimensionType}: {row.dimensionValue}</strong><span>{row.horizonDays}d</span></div><p className="text-sm text-slate-400">{row.outlook} · score {row.combinedGrowthScore} · confidence {row.confidence}% · evidence {row.internalObservations} internal / {row.externalObservations} external</p></div>)}</div></div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">Sales / consumption tax collected by location</h2><div className="mt-3 overflow-x-auto rounded-xl border border-slate-700"><table className="w-full text-sm"><thead className="bg-slate-900 text-left text-slate-400"><tr><th className="p-3">Jurisdiction</th><th className="p-3">Tax</th><th className="p-3">Transactions</th><th className="p-3">Taxable sales</th><th className="p-3">Collected</th></tr></thead><tbody>{snap.taxByLocation.map((row, index) => <tr key={`${row.countryCode}-${row.subdivisionCode}-${row.locality}-${index}`} className="border-t border-slate-800"><td className="p-3">{[row.countryCode,row.subdivisionCode,row.locality].filter(Boolean).join(' / ')}</td><td className="p-3">{row.taxName}</td><td className="p-3">{row.taxableTransactions}</td><td className="p-3">{money(row.taxableSales,row.currency)}</td><td className="p-3 font-bold">{money(row.taxCollected,row.currency)}</td></tr>)}</tbody></table></div></section>

      <section className="mt-10"><h2 className="text-xl font-bold">Tax liabilities & remittance</h2><div className="mt-3 overflow-x-auto rounded-xl border border-slate-700"><table className="w-full text-sm"><thead className="bg-slate-900 text-left text-slate-400"><tr><th className="p-3">Jurisdiction</th><th className="p-3">Type</th><th className="p-3">Period</th><th className="p-3">Collected</th><th className="p-3">Accrued</th><th className="p-3">Remitted</th><th className="p-3">Due</th><th className="p-3">Filing due</th></tr></thead><tbody>{snap.taxLiabilities.map((row, index) => <tr key={`${row.countryCode}-${row.jurisdictionCode}-${row.periodStart}-${index}`} className="border-t border-slate-800"><td className="p-3">{[row.countryCode,row.jurisdictionCode].filter(Boolean).join(' / ')}</td><td className="p-3">{row.taxType}</td><td className="p-3">{row.periodStart} — {row.periodEnd}</td><td className="p-3">{money(row.taxCollected,row.currency)}</td><td className="p-3">{money(row.taxAccrued,row.currency)}</td><td className="p-3">{money(row.taxRemitted,row.currency)}</td><td className="p-3 font-bold">{money(row.amountDue,row.currency)}</td><td className="p-3">{row.filingDueAt ? new Date(row.filingDueAt).toLocaleDateString() : '—'}</td></tr>)}</tbody></table></div></section>

      <p className="mt-8 text-xs text-slate-500">Generated {new Date(snap.generatedAt).toLocaleString()}. Forecasts are decision support, not guarantees.</p>
    </main>
  );
}
