import Link from "next/link";

const NAV = [
  { href: "/executive/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/executive/kpi", label: "Know Your Numbers", icon: "🎯" },
  { href: "/executive/finance", label: "Financial", icon: "💰" },
  { href: "/executive/analytics", label: "Analytics", icon: "📈" },
  { href: "/executive/marketing", label: "Marketing", icon: "📣" },
  { href: "/executive/system", label: "System Health", icon: "🔧" },
];

export default function ExecutiveNav() {
  return (
    <nav className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-[#0a1525] px-6 py-3">
      <Link
        href="/executive/dashboard"
        className="mr-4 text-xs font-black uppercase tracking-[0.3em] text-yellow-400 hover:text-yellow-300"
      >
        ◆ Executive
      </Link>
      {NAV.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <span className="mr-1.5">{icon}</span>
          {label}
        </Link>
      ))}
      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/admin/content"
          className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-300"
        >
          ← Admin CMS
        </Link>
        <form action="/api/executive/auth/logout" method="POST">
          <button
            type="submit"
            className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-400"
          >
            Sign Out
          </button>
        </form>
      </div>
    </nav>
  );
}
