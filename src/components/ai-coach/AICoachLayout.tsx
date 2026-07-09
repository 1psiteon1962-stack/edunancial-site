import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/ai-coach", label: "Dashboard", icon: "🏠" },
  { href: "/ai-coach/goals", label: "Goals", icon: "🎯" },
  { href: "/ai-coach/learning", label: "Learning", icon: "📚" },
  { href: "/ai-coach/recommendations", label: "Recommendations", icon: "💡" },
  { href: "/ai-coach/insights", label: "Insights", icon: "📊" },
  { href: "/ai-coach/notifications", label: "Notifications", icon: "🔔" },
];

interface Props {
  children: React.ReactNode;
  activeHref: string;
}

export default function AICoachLayout({ children, activeHref }: Props) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Top nav */}
        <nav
          aria-label="AI Coach navigation"
          className="mb-8 overflow-x-auto"
        >
          <ul className="flex min-w-max gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {children}
      </div>
    </main>
  );
}
