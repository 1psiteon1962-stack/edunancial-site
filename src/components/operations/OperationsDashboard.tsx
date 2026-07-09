import OperationsMetricCard from "@/components/operations/OperationsMetricCard";
import StatusBadge from "@/components/operations/StatusBadge";
import { LogQuery, OperationsDashboardData } from "@/lib/operations/types";

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OperationsDashboard({
  dashboard,
  filters,
}: {
  dashboard: OperationsDashboardData;
  filters: LogQuery;
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <header className="rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Operations command center</p>
              <h1 className="mt-4 text-4xl font-black sm:text-5xl">Enterprise Infrastructure &amp; Resilience Dashboard</h1>
              <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
                Cloud-agnostic monitoring, observability, centralized logging, backups, disaster recovery,
                and high-availability readiness for Edunancial&apos;s future multi-region platform.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-300">
              <div>
                <span className="font-semibold text-white">Provider:</span> {dashboard.summary.providerLabel}
              </div>
              <div>
                <span className="font-semibold text-white">Last updated:</span> {formatTimestamp(dashboard.summary.lastUpdatedAt)}
              </div>
              <div>
                <span className="font-semibold text-white">Dashboard mode:</span> demo-safe adapters with typed contracts
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="summary highlights">
            <div className="rounded-2xl border border-white/10 bg-[#081523] p-5">
              <p className="text-sm text-slate-400">System uptime</p>
              <p className="mt-2 text-3xl font-black">{dashboard.summary.uptimePercentage.toFixed(3)}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#081523] p-5">
              <p className="text-sm text-slate-400">Active users</p>
              <p className="mt-2 text-3xl font-black">{dashboard.summary.activeUsers.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#081523] p-5">
              <p className="text-sm text-slate-400">API availability</p>
              <p className="mt-2 text-3xl font-black">{dashboard.summary.apiAvailabilityPercent.toFixed(2)}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#081523] p-5">
              <p className="text-sm text-slate-400">Error rate</p>
              <p className="mt-2 text-3xl font-black">{dashboard.summary.errorRatePercent.toFixed(2)}%</p>
            </div>
          </div>
        </header>

        <section className="mt-10" aria-labelledby="operations-metrics-heading">
          <div className="flex items-center justify-between gap-4">
            <h2 id="operations-metrics-heading" className="text-2xl font-black sm:text-3xl">Centralized infrastructure monitoring</h2>
            <StatusBadge tone="demo">demo adapters ready for live providers</StatusBadge>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {dashboard.metrics.map((metric) => (
              <OperationsMetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.35fr_1fr]" aria-labelledby="service-health-heading">
          <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow">
            <div className="flex items-center justify-between gap-4">
              <h2 id="service-health-heading" className="text-2xl font-black">Service health and availability</h2>
              <StatusBadge tone="healthy">HA ready</StatusBadge>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="pb-3 pr-4 font-semibold">Service</th>
                    <th className="pb-3 pr-4 font-semibold">Region</th>
                    <th className="pb-3 pr-4 font-semibold">Latency</th>
                    <th className="pb-3 pr-4 font-semibold">Uptime</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.services.map((service) => (
                    <tr key={service.id} className="border-t border-white/5 align-top">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-white">{service.name}</div>
                        <div className="mt-1 text-slate-400">{service.summary}</div>
                      </td>
                      <td className="py-4 pr-4 text-slate-300">{service.region}</td>
                      <td className="py-4 pr-4 text-slate-300">{service.latencyMs} ms</td>
                      <td className="py-4 pr-4 text-slate-300">{service.uptimePercentage.toFixed(2)}%</td>
                      <td className="py-4"><StatusBadge tone={service.status}>{service.status}</StatusBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow" aria-labelledby="observability-heading">
            <h2 id="observability-heading" className="text-2xl font-black">Observability integration points</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {dashboard.observabilityAdapters.map((adapter) => (
                <StatusBadge key={adapter.id} tone={adapter.status}>{adapter.name}</StatusBadge>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              {dashboard.observabilityPanels.map((panel) => (
                <article key={panel.id} className="rounded-2xl border border-white/10 bg-[#081523] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold">{panel.title}</h3>
                    <StatusBadge tone={panel.status}>{panel.status}</StatusBadge>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{panel.summary}</p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-400">
                    {panel.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_1fr]" aria-labelledby="alerts-heading">
          <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow">
            <div className="flex items-center justify-between gap-4">
              <h2 id="alerts-heading" className="text-2xl font-black">Alerting framework</h2>
              <StatusBadge tone="ready">acknowledgement-ready model</StatusBadge>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {dashboard.alertHistory.map((alert) => (
                <article key={alert.id} className="rounded-2xl border border-white/10 bg-[#081523] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{alert.name}</h3>
                      <p className="mt-2 text-sm text-slate-300">{alert.message}</p>
                    </div>
                    <StatusBadge tone={alert.triggered ? alert.severity : "healthy"}>
                      {alert.triggered ? alert.severity : "normal"}
                    </StatusBadge>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    <p>Observed value: {alert.observedValue}</p>
                    <p>Threshold: {alert.threshold}</p>
                    <p>Routing: {alert.routeTo.join(", ")}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#081523] p-5">
              <h3 className="text-lg font-bold">Notification abstraction</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {dashboard.notificationChannels.map((channel) => (
                  <StatusBadge key={channel.id} tone={channel.status}>{channel.name}</StatusBadge>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow" aria-labelledby="backup-heading">
            <h2 id="backup-heading" className="text-2xl font-black">Backup and recovery posture</h2>
            <div className="mt-6 space-y-4">
              {dashboard.backups.map((backup) => (
                <article key={backup.id} className="rounded-2xl border border-white/10 bg-[#081523] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{backup.resource}</h3>
                      <p className="mt-1 text-sm text-slate-400">{backup.location}</p>
                    </div>
                    <StatusBadge tone={backup.status === "failed" ? "critical" : backup.status === "running" ? "warning" : "healthy"}>
                      {backup.status}
                    </StatusBadge>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-500">Scheduled for</dt>
                      <dd>{formatTimestamp(backup.scheduledFor)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Completed</dt>
                      <dd>{backup.completedAt ? formatTimestamp(backup.completedAt) : "Pending"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Verification</dt>
                      <dd>{backup.verification.status}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Restore test</dt>
                      <dd>{backup.restoreTest.status}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow" aria-labelledby="logging-heading">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 id="logging-heading" className="text-2xl font-black">Centralized structured logging</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-300">
                Redaction-first log events across application, authentication, security, payment, API,
                database, and background job activity with retention abstraction for future policy enforcement.
              </p>
            </div>
            <StatusBadge tone="ready">retention abstraction</StatusBadge>
          </div>
          <form method="get" className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-[#081523] p-5 md:grid-cols-4" aria-label="log filters">
            <label className="grid gap-2 text-sm text-slate-300">
              Search logs
              <input
                type="search"
                name="query"
                defaultValue={filters.query ?? ""}
                placeholder="request id, route, message"
                className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Severity
              <select
                name="severity"
                defaultValue={filters.severity ?? "all"}
                className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">All severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Event type
              <select
                name="eventType"
                defaultValue={filters.eventType ?? "all"}
                className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">All event types</option>
                <option value="application">Application</option>
                <option value="authentication">Authentication</option>
                <option value="administrative">Administrative</option>
                <option value="security">Security</option>
                <option value="payment">Payment</option>
                <option value="background-job">Background job</option>
                <option value="api-request">API request</option>
                <option value="database-error">Database error</option>
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Apply filters
              </button>
            </div>
          </form>
          <div className="mt-6 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {dashboard.logs.map((event) => (
                <article key={event.id} className="rounded-2xl border border-white/10 bg-[#081523] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold">{event.message}</h3>
                        <StatusBadge tone={event.severity}>{event.severity}</StatusBadge>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        {event.eventType} · correlation {event.correlationId} · {formatTimestamp(event.timestamp)}
                      </p>
                    </div>
                    {event.actor ? <p className="text-sm text-slate-300">{event.actor.displayName}</p> : null}
                  </div>
                  <div className="mt-4 rounded-xl bg-[#101a2f] p-4 text-sm text-slate-300">
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs text-slate-300">{JSON.stringify(event.context, null, 2)}</pre>
                    {event.redactedFields.length > 0 ? (
                      <p className="mt-3 text-xs text-slate-500">Redacted: {event.redactedFields.join(", ")}</p>
                    ) : null}
                  </div>
                </article>
              ))}
              {dashboard.logs.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-[#081523] p-5 text-sm text-slate-400">
                  No logs match the selected filters.
                </p>
              ) : null}
            </div>
            <aside className="rounded-2xl border border-white/10 bg-[#081523] p-5">
              <h3 className="text-lg font-bold">Retention policy</h3>
              <dl className="mt-4 space-y-3 text-sm text-slate-300">
                <div>
                  <dt className="text-slate-500">Hot retention</dt>
                  <dd>{dashboard.logRetention.hotRetentionDays} days</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Cold retention</dt>
                  <dd>{dashboard.logRetention.coldRetentionDays} days</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Archive class</dt>
                  <dd>{dashboard.logRetention.archiveStorageClass}</dd>
                </div>
              </dl>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-400">
                {dashboard.logRetention.complianceNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr]" aria-labelledby="dr-heading">
          <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow">
            <div className="flex items-center justify-between gap-4">
              <h2 id="dr-heading" className="text-2xl font-black">Disaster recovery framework</h2>
              <StatusBadge tone="warning">warm standby strategy</StatusBadge>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#081523] p-5">
                <p className="text-sm text-slate-400">RTO</p>
                <p className="mt-2 text-3xl font-black">{dashboard.disasterRecovery.rtoMinutes} min</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#081523] p-5">
                <p className="text-sm text-slate-400">RPO</p>
                <p className="mt-2 text-3xl font-black">{dashboard.disasterRecovery.rpoMinutes} min</p>
              </div>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <p><span className="font-semibold text-white">Primary strategy:</span> {dashboard.disasterRecovery.primaryStrategy}</p>
              <p><span className="font-semibold text-white">Failover:</span> {dashboard.disasterRecovery.failoverStrategy}</p>
              <div>
                <h3 className="font-bold text-white">Restoration validation</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-400">
                  {dashboard.disasterRecovery.restorationValidation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow" aria-labelledby="ha-heading">
            <div className="flex items-center justify-between gap-4">
              <h2 id="ha-heading" className="text-2xl font-black">High availability readiness</h2>
              <StatusBadge tone="ready">kubernetes compatible</StatusBadge>
            </div>
            <div className="mt-6 space-y-4">
              {dashboard.failoverReadiness.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-[#081523] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">Owner: {item.owner}</p>
                    </div>
                    <StatusBadge tone={item.status}>{item.status}</StatusBadge>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{item.summary}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]" aria-labelledby="runbook-heading">
          <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow">
            <h2 id="runbook-heading" className="text-2xl font-black">Incident response runbook</h2>
            <ol className="mt-6 space-y-4">
              {dashboard.runbook.map((step, index) => (
                <li key={step.id} className="rounded-2xl border border-white/10 bg-[#081523] p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</p>
                  <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{step.action}</p>
                  <p className="mt-2 text-xs text-slate-500">Owner: {step.owner}</p>
                </li>
              ))}
            </ol>
          </article>
          <aside className="rounded-3xl border border-white/10 bg-[#101a2f] p-8 shadow">
            <h2 className="text-2xl font-black">Operational endpoints</h2>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li><code className="rounded bg-[#081523] px-2 py-1 text-blue-200">/api/health</code> overall health snapshot</li>
              <li><code className="rounded bg-[#081523] px-2 py-1 text-blue-200">/api/health/readiness</code> readiness for traffic</li>
              <li><code className="rounded bg-[#081523] px-2 py-1 text-blue-200">/api/health/liveness</code> process liveness heartbeat</li>
              <li><code className="rounded bg-[#081523] px-2 py-1 text-blue-200">/api/operations/dashboard</code> dashboard JSON payload</li>
              <li><code className="rounded bg-[#081523] px-2 py-1 text-blue-200">/api/operations/logs</code> filtered structured log feed</li>
            </ul>
          </aside>
        </section>
      </section>
    </main>
  );
}
