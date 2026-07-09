import { DR_OBJECTIVES, RUNBOOKS, RECOVERY_CHECKLISTS, FAILOVER_CONFIG } from "@/lib/disaster-recovery";
import StatusBadge from "@/components/monitoring/StatusBadge";
import Link from "next/link";

export const metadata = { title: "Disaster Recovery" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

const TIER_COLORS: Record<string, string> = {
  critical: "text-red-400",
  high:     "text-amber-400",
  medium:   "text-yellow-400",
  low:      "text-blue-400",
};

export default function DisasterRecoveryPage() {
  const checklist = RECOVERY_CHECKLISTS[0];

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-6 md:p-10">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black md:text-5xl">Disaster Recovery</h1>
          <p className="mt-2 text-gray-400">RTO/RPO targets, runbooks, failover config, and recovery checklists</p>
        </div>
        <Link href="/admin/infrastructure" className="text-sm text-blue-400 hover:underline">← Infrastructure Dashboard</Link>
      </div>

      {/* Failover config */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-[#101a2f] p-6" aria-label="Failover configuration">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Failover Configuration</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div><p className="text-gray-500">Primary Region</p><p className="font-bold text-white mt-1">{FAILOVER_CONFIG.primaryRegion}</p></div>
          <div><p className="text-gray-500">Failover Regions</p><p className="font-bold text-white mt-1">{FAILOVER_CONFIG.failoverRegions.join(", ")}</p></div>
          <div>
            <p className="text-gray-500">Automatic Failover</p>
            <p className={`font-bold mt-1 ${FAILOVER_CONFIG.automaticFailoverEnabled ? "text-emerald-400" : "text-amber-400"}`}>
              {FAILOVER_CONFIG.automaticFailoverEnabled ? "Enabled" : "Disabled (manual)"}
            </p>
          </div>
          <div><p className="text-gray-500">Health Check Interval</p><p className="font-bold text-white mt-1">{FAILOVER_CONFIG.healthCheckIntervalSeconds}s</p></div>
          <div><p className="text-gray-500">Failure Threshold</p><p className="font-bold text-white mt-1">{FAILOVER_CONFIG.failoverThresholdFailures} consecutive failures</p></div>
          <div><p className="text-gray-500">DNS Failover</p><p className={`font-bold mt-1 ${FAILOVER_CONFIG.dnsFailoverEnabled ? "text-emerald-400" : "text-gray-500"}`}>{FAILOVER_CONFIG.dnsFailoverEnabled ? "Enabled" : "Not configured"}</p></div>
        </div>
      </section>

      {/* RTO/RPO table */}
      <section className="mt-8" aria-label="RTO/RPO objectives">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">RTO / RPO Targets by Service</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                {["Service", "Tier", "RTO (max downtime)", "RPO (max data loss)", "Last Tested", "Test Status"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DR_OBJECTIVES.map((obj) => (
                <tr key={obj.service} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{obj.service}</td>
                  <td className={`px-4 py-3 font-semibold capitalize ${TIER_COLORS[obj.rto.tier]}`}>{obj.rto.tier}</td>
                  <td className="px-4 py-3 text-gray-300">{obj.rto.maxDowntimeMinutes} min</td>
                  <td className="px-4 py-3 text-gray-300">{obj.rpo.maxDataLossMinutes} min</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {obj.lastTestedAt ? new Date(obj.lastTestedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {obj.testStatus === "passed"    && <StatusBadge status="healthy"  label="Passed"    size="sm" />}
                    {obj.testStatus === "failed"    && <StatusBadge status="down"     label="Failed"    size="sm" />}
                    {obj.testStatus === "not_tested"&& <StatusBadge status="unknown"  label="Not Tested" size="sm" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Runbooks */}
      <section className="mt-8" aria-label="Incident runbooks">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Incident Runbooks</h2>
        <div className="space-y-6">
          {RUNBOOKS.map((rb) => (
            <div key={rb.id} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-mono text-gray-500">{rb.id}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{rb.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Trigger: {rb.triggerCondition}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase ${TIER_COLORS[rb.severity === "sev1" ? "critical" : rb.severity === "sev2" ? "high" : "medium"]}`}>{rb.severity.toUpperCase()}</span>
                  <span className="text-xs text-gray-400">~{rb.estimatedResolutionMinutes} min</span>
                </div>
              </div>

              {/* Steps */}
              <ol className="space-y-3">
                {rb.steps.map((step) => (
                  <li key={step.order} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-xs flex items-center justify-center font-bold text-gray-400">
                      {step.order}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{step.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                      {step.commands && step.commands.length > 0 && (
                        <pre className="mt-2 text-xs bg-black/30 rounded-lg p-3 overflow-x-auto text-green-300 font-mono">
                          {step.commands.join("\n")}
                        </pre>
                      )}
                      <p className="text-xs text-gray-600 mt-1">Expected: {step.expectedOutcome}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Escalation */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Escalation Path</p>
                <div className="flex flex-wrap gap-3">
                  {rb.escalationPath.map((esc) => (
                    <div key={esc.level} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs">
                      <p className="font-bold text-white">L{esc.level} @ {esc.triggerAfterMinutes}m</p>
                      <p className="text-gray-400">{esc.notifyRoles.join(", ")}</p>
                      <p className="text-gray-600 capitalize">{esc.channel}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recovery checklist */}
      <section className="mt-8" aria-label="Infrastructure recovery checklist">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          {checklist.name}
        </h2>
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <ol className="space-y-3">
            {checklist.steps.map((step) => (
              <li key={step.id} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-xs flex items-center justify-center font-bold text-gray-400 mt-0.5">
                  {step.order}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{step.description}</p>
                    <span className="text-xs text-gray-500 flex-shrink-0">{step.owner} · {step.estimatedMinutes}m</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Verify: {step.verificationCriteria}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Docs link */}
      <section className="mt-8 rounded-2xl border border-blue-700/30 bg-blue-900/10 p-6">
        <h2 className="text-sm font-semibold text-blue-300 mb-2">Documentation</h2>
        <p className="text-sm text-gray-400">
          Full DR procedures and runbook templates are available in{" "}
          <code className="text-blue-300">docs/infrastructure/disaster-recovery.md</code>.
          Customize <code className="text-blue-300">src/lib/disaster-recovery/config.ts</code> to match your actual SLA commitments.
        </p>
      </section>

    </main>
  );
}
