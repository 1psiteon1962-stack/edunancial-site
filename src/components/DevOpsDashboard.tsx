"use client";

export type DeploymentRecord = {
  id: string;
  version: string;
  environment: "production" | "staging" | "development";
  status: "success" | "failed" | "in-progress" | "rolled-back";
  deployedBy: string;
  timestamp: string;
  url: string;
  sha: string;
  canRollback: boolean;
};

export type BuildRecord = {
  id: string;
  sha: string;
  branch: string;
  status: "success" | "failed" | "running" | "queued";
  duration: string;
  triggeredBy: string;
  timestamp: string;
  failureReason?: string;
};

export type EnvironmentHealth = {
  name: string;
  status: "healthy" | "degraded" | "down" | "unknown";
  version: string;
  url: string;
  lastChecked: string;
};

const DEMO_DEPLOYMENTS: DeploymentRecord[] = [
  {
    id: "dep-001",
    version: "v1.4.2",
    environment: "production",
    status: "success",
    deployedBy: "release-bot",
    timestamp: "2025-01-09T18:00:00Z",
    url: "https://www.edunancial.com",
    sha: "a3f9d12",
    canRollback: true,
  },
  {
    id: "dep-002",
    version: "v1.4.1",
    environment: "production",
    status: "rolled-back",
    deployedBy: "release-bot",
    timestamp: "2025-01-08T14:22:00Z",
    url: "https://www.edunancial.com",
    sha: "b7c21e4",
    canRollback: false,
  },
  {
    id: "dep-003",
    version: "v1.4.2",
    environment: "staging",
    status: "success",
    deployedBy: "ci-pipeline",
    timestamp: "2025-01-09T16:45:00Z",
    url: "https://staging.edunancial.com",
    sha: "a3f9d12",
    canRollback: true,
  },
  {
    id: "dep-004",
    version: "v1.4.3-beta.1",
    environment: "development",
    status: "in-progress",
    deployedBy: "ci-pipeline",
    timestamp: "2025-01-09T21:30:00Z",
    url: "https://dev.edunancial.com",
    sha: "c9e44f8",
    canRollback: false,
  },
];

const DEMO_BUILDS: BuildRecord[] = [
  {
    id: "build-041",
    sha: "a3f9d12",
    branch: "main",
    status: "success",
    duration: "3m 12s",
    triggeredBy: "push",
    timestamp: "2025-01-09T17:50:00Z",
  },
  {
    id: "build-040",
    sha: "b7c21e4",
    branch: "main",
    status: "failed",
    duration: "1m 44s",
    triggeredBy: "push",
    timestamp: "2025-01-08T14:10:00Z",
    failureReason: "Lighthouse performance score below threshold (0.62 < 0.70)",
  },
  {
    id: "build-039",
    sha: "d12a3c7",
    branch: "feature/course-catalog",
    status: "success",
    duration: "3m 08s",
    triggeredBy: "pull_request",
    timestamp: "2025-01-08T11:00:00Z",
  },
  {
    id: "build-038",
    sha: "e0b11f2",
    branch: "develop",
    status: "running",
    duration: "—",
    triggeredBy: "push",
    timestamp: "2025-01-09T21:28:00Z",
  },
];

const DEMO_ENVIRONMENTS: EnvironmentHealth[] = [
  {
    name: "Production",
    status: "healthy",
    version: "v1.4.2",
    url: "https://www.edunancial.com",
    lastChecked: "2025-01-09T21:40:00Z",
  },
  {
    name: "Staging",
    status: "healthy",
    version: "v1.4.2",
    url: "https://staging.edunancial.com",
    lastChecked: "2025-01-09T21:40:00Z",
  },
  {
    name: "Development",
    status: "degraded",
    version: "v1.4.3-beta.1",
    url: "https://dev.edunancial.com",
    lastChecked: "2025-01-09T21:40:00Z",
  },
];

const statusColors: Record<string, string> = {
  success: "text-emerald-400",
  healthy: "text-emerald-400",
  failed: "text-red-400",
  down: "text-red-400",
  "in-progress": "text-yellow-400",
  running: "text-yellow-400",
  queued: "text-blue-400",
  "rolled-back": "text-purple-400",
  degraded: "text-orange-400",
  unknown: "text-gray-400",
};

const statusDots: Record<string, string> = {
  success: "bg-emerald-400",
  healthy: "bg-emerald-400",
  failed: "bg-red-400",
  down: "bg-red-400",
  "in-progress": "bg-yellow-400 animate-pulse",
  running: "bg-yellow-400 animate-pulse",
  queued: "bg-blue-400",
  "rolled-back": "bg-purple-400",
  degraded: "bg-orange-400",
  unknown: "bg-gray-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`flex items-center gap-1.5 ${statusColors[status] ?? "text-gray-400"}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${statusDots[status] ?? "bg-gray-400"}`} />
      <span className="capitalize">{status.replace("-", " ")}</span>
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default function DevOpsDashboard() {
  const current = DEMO_DEPLOYMENTS.find(
    (d) => d.environment === "production" && d.status === "success"
  );

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-5xl font-black tracking-tight">DevOps Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Deployment status, build history, and environment health
          </p>
        </div>
        <span className="rounded-full bg-blue-600/20 border border-blue-500/40 px-4 py-1 text-sm text-blue-300 font-mono">
          DEMO DATA
        </span>
      </div>

      {/* Current version + env health */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {/* Current Version */}
        <div className="col-span-full lg:col-span-1 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">
            Current Version
          </p>
          <p className="text-4xl font-black font-mono">{current?.version ?? "—"}</p>
          <p className="mt-2 text-sm text-gray-400">
            Deployed {current ? formatDate(current.timestamp) : "N/A"}
          </p>
        </div>

        {/* Environment health cards */}
        {DEMO_ENVIRONMENTS.map((env) => (
          <div
            key={env.name}
            className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"
          >
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">
              {env.name}
            </p>
            <StatusBadge status={env.status} />
            <p className="mt-2 text-sm font-mono text-gray-300">{env.version}</p>
            <p className="text-xs text-gray-500 mt-1">
              Checked {formatDate(env.lastChecked)}
            </p>
          </div>
        ))}
      </section>

      {/* Deployment History */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Deployment History</h2>
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="text-left p-4">Version</th>
                <th className="text-left p-4">Environment</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Deployed By</th>
                <th className="text-left p-4">Timestamp</th>
                <th className="text-left p-4">SHA</th>
                <th className="text-left p-4">Rollback</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_DEPLOYMENTS.map((dep) => (
                <tr
                  key={dep.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-mono font-bold">{dep.version}</td>
                  <td className="p-4 capitalize">{dep.environment}</td>
                  <td className="p-4">
                    <StatusBadge status={dep.status} />
                  </td>
                  <td className="p-4 text-gray-300">{dep.deployedBy}</td>
                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {formatDate(dep.timestamp)}
                  </td>
                  <td className="p-4 font-mono text-gray-400">{dep.sha}</td>
                  <td className="p-4">
                    {dep.canRollback ? (
                      <span className="rounded-md bg-purple-600/20 border border-purple-500/40 px-2 py-0.5 text-xs text-purple-300">
                        Available
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Build History */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Build History</h2>
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="text-left p-4">Build</th>
                <th className="text-left p-4">Branch</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Duration</th>
                <th className="text-left p-4">Trigger</th>
                <th className="text-left p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_BUILDS.map((build) => (
                <tr
                  key={build.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-mono">
                    <span className="text-gray-400">{build.id}</span>
                    <span className="ml-2 text-gray-500">({build.sha})</span>
                  </td>
                  <td className="p-4 font-mono text-blue-300">{build.branch}</td>
                  <td className="p-4">
                    <div>
                      <StatusBadge status={build.status} />
                      {build.failureReason && (
                        <p className="text-xs text-red-400 mt-1 max-w-xs">
                          {build.failureReason}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{build.duration}</td>
                  <td className="p-4 text-gray-300">{build.triggeredBy}</td>
                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {formatDate(build.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Release Notes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Release Notes</h2>
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl font-black text-blue-300">v1.4.2</span>
            <span className="text-sm text-gray-400">Released Jan 9, 2025</span>
          </div>
          <ul className="space-y-2 text-gray-300 text-sm list-none">
            {[
              "✨ Added DevOps deployment dashboard (/admin/devops)",
              "✨ Implemented enterprise CI/CD pipeline with GitHub Actions",
              "✨ Added release management workflow with automated changelog",
              "🔒 Integrated security scanning (CodeQL, TruffleHog, license check)",
              "🐛 Fixed Lighthouse performance score regression on homepage",
              "🔧 Updated Node.js version to 20 across all environments",
            ].map((note) => (
              <li key={note} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">{note.charAt(0)}</span>
                <span>{note.slice(2)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 pt-2 border-t border-white/10">
            Full changelog available in{" "}
            <code className="font-mono text-blue-400">CHANGELOG.md</code>
          </p>
        </div>
      </section>
    </main>
  );
}
