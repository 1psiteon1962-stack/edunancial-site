import Link from "next/link";

import SystemHealthCard from "@/components/executive/SystemHealthCard";
import ExecutiveKPICard from "@/components/executive/ExecutiveKPICard";
import { requireOwnerPageSession } from "@/lib/admin-content/auth";
import { getSystemHealthKPIs } from "@/lib/executive/adapters";

export const metadata = {
  title: "System Health | Edunancial Executive",
};

export const dynamic = "force-dynamic";

export default async function ExecutiveSystemPage() {
  await requireOwnerPageSession();
  const sys = await getSystemHealthKPIs();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">
            System Health
          </p>
          <h1 className="mt-2 text-4xl font-black">Platform Status</h1>
          <p className="mt-2 text-slate-400">
            Application, database, infrastructure, and API health monitoring.
          </p>
        </div>
        <Link href="/executive/dashboard" className="text-sm text-slate-500 hover:text-slate-300">
          ← Dashboard
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Service Status</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SystemHealthCard name={sys.application.name} status={sys.application.status} latencyMs={sys.application.latencyMs} />
          <SystemHealthCard name={sys.database.name} status={sys.database.status} latencyMs={sys.database.latencyMs} />
          <SystemHealthCard name={sys.supabase.name} status={sys.supabase.status} latencyMs={sys.supabase.latencyMs} />
          <SystemHealthCard name={sys.netlify.name} status={sys.netlify.status} latencyMs={sys.netlify.latencyMs} />
          <SystemHealthCard name={sys.apiHealth.name} status={sys.apiHealth.status} latencyMs={sys.apiHealth.latencyMs} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Infrastructure</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ExecutiveKPICard label="Storage Usage" value={`${sys.storage.value} MB`} status={sys.storage.status} accent="border-blue-500" />
          <ExecutiveKPICard label="Bandwidth Usage" value={`${sys.bandwidth.value} GB`} status={sys.bandwidth.status} accent="border-blue-500" />
        </div>
      </section>

      <div className="mt-10 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
        <p className="text-sm font-bold text-yellow-400">⚡ Integration Pending</p>
        <p className="mt-2 text-sm text-slate-400">
          Connect Supabase health API, Netlify status webhooks, and application uptime monitoring.
          The adapter in <code className="rounded bg-slate-800 px-1">src/lib/executive/adapters.ts</code>
          exposes <code className="rounded bg-slate-800 px-1">getSystemHealthKPIs()</code> as the extension point.
        </p>
      </div>
    </main>
  );
}
