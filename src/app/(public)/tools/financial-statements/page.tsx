import Link from "next/link";
import { getServerLanguage } from "@/lib/international/server";
import { financialToolkitText } from "@/lib/financial-statements/translations";
import { financialStatementExample } from "@/lib/financial-statements/toolkit";

export const dynamic = "force-dynamic";
export const metadata = { title: "Financial Statements Toolkit | Edunancial" };

export default async function FinancialStatementsPage() {
  const language = await getServerLanguage();
  const t = (key: string) => financialToolkitText(language, key);
  const money = new Intl.NumberFormat(language, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const rows = financialStatementExample.income.lines;
  return <main className="min-h-screen bg-[#08101f] text-white"><section className="mx-auto max-w-6xl px-6 py-14">
    <nav className="mb-8 text-sm text-slate-400"><Link href="/tools" className="hover:text-white">{t("tools")}</Link> / {t("title")}</nav>
    <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">{t("eyebrow")}</p><h1 className="mt-3 text-4xl font-black md:text-5xl">{t("title")}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{t("intro")}</p>
    <div className="mt-10 grid gap-5 md:grid-cols-3">{["incomeStatement","balanceSheet","cashFlowStatement"].map((name) => <article key={name} className="rounded-3xl border border-white/10 bg-slate-950/50 p-6"><h2 className="text-2xl font-black">{t(`${name}.title`)}</h2><p className="mt-3 leading-7 text-slate-300">{t(`${name}.description`)}</p></article>)}</div>
    <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/50 p-6 md:p-8"><p className="text-sm font-black uppercase tracking-wider text-yellow-300">{t("sample")}</p><h2 className="mt-2 text-3xl font-black">{t("incomeStatement.title")}</h2><p className="mt-1 text-slate-400">{t("samplePeriod")}</p><div className="mt-6 overflow-hidden rounded-2xl border border-white/10">{rows.map(({key,value}) => <div key={key} className="flex items-center justify-between gap-5 border-b border-white/10 px-5 py-4 last:border-0"><div><div className="font-bold">{t(`line.${key}`)}</div><div className="mt-1 text-sm text-slate-400">{t(`explain.${key}`)}</div></div><div className="shrink-0 font-mono font-bold">{money.format(value)}</div></div>)}</div><div className="mt-6 rounded-2xl bg-emerald-400/10 p-5"><h3 className="font-black text-emerald-300">{t("ownerQuestion.title")}</h3><p className="mt-2 text-slate-200">{t("ownerQuestion.body")}</p></div></section><p className="mt-8 text-sm leading-6 text-slate-400">{t("disclaimer")}</p>
  </section></main>;
}
