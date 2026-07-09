import Link from "next/link";

const modules = [
  {
    title: "Executive Dashboard",
    href: "/admin/dashboard",
  },
  {
    title: "Book Management",
    href: "/admin/books",
  },
  {
    title: "Course Management",
    href: "/admin/courses",
  },
  {
    title: "Financial Terms",
    href: "/admin/terms",
  },
  {
    title: "Customers",
    href: "/admin/customers",
  },
  {
    title: "Regions",
    href: "/admin/regions",
  },
  {
    title: "Languages",
    href: "/admin/languages",
  },
  {
    title: "KPI Center",
    href: "/admin/kpis",
  },
  {
    title: "System Settings",
    href: "/admin/settings",
  },
];

const infrastructureModules = [
  {
    title: "Infrastructure Dashboard",
    href: "/admin/infrastructure",
    description: "Real-time server health, resource utilization, and operational overview",
    badge: "Live",
  },
  {
    title: "Application Monitoring",
    href: "/admin/monitoring",
    description: "API performance, database metrics, queue health, and observability events",
    badge: "Live",
  },
  {
    title: "Log Viewer",
    href: "/admin/logs",
    description: "Structured centralized logging — auth, security, payments, API requests",
    badge: "Live",
  },
  {
    title: "Backup Management",
    href: "/admin/backups",
    description: "Automated backup schedules, verification status, and restore readiness",
    badge: "Live",
  },
  {
    title: "Disaster Recovery",
    href: "/admin/disaster-recovery",
    description: "RTO/RPO targets, incident runbooks, failover config, and recovery checklists",
    badge: "Live",
  },
  {
    title: "Alerts",
    href: "/admin/alerts",
    description: "Configurable alert rules, notification channels, and routing configuration",
    badge: "Live",
  },
];

export default function AdminPortal() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">
      <h1 className="text-6xl font-black">
        ADMIN PORTAL
      </h1>

      <p className="mt-6 text-xl text-gray-300">
        Global Administration Console
      </p>

      {/* Infrastructure & Ops section */}
      <div className="mt-16">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
          Infrastructure & Operations
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {infrastructureModules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="group rounded-2xl border border-emerald-700/30 bg-emerald-900/10 p-8 hover:border-emerald-500/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-2xl font-black group-hover:text-emerald-300 transition-colors">
                  {module.title}
                </h3>
                {module.badge && (
                  <span className="flex-shrink-0 rounded-full bg-emerald-900/60 border border-emerald-700/60 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                    {module.badge}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-400">{module.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Business modules */}
      <div className="mt-16">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
          Business Operations
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="rounded-2xl border border-white/10 bg-[#101a2f] p-8 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-3xl font-black">
                {module.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
