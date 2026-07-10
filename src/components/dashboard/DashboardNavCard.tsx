import Link from "next/link";

interface DashboardNavCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  accent?: string;
}

export default function DashboardNavCard({
  href,
  icon,
  title,
  description,
  accent = "blue",
}: DashboardNavCardProps) {
  const accentMap: Record<string, string> = {
    blue: "group-hover:text-blue-400 border-blue-600",
    red: "group-hover:text-red-400 border-red-600",
    yellow: "group-hover:text-yellow-400 border-yellow-500",
    green: "group-hover:text-green-400 border-green-600",
    purple: "group-hover:text-purple-400 border-purple-600",
    orange: "group-hover:text-orange-400 border-orange-600",
    white: "group-hover:text-white border-slate-400",
  };

  const accentClasses = accentMap[accent] ?? accentMap.blue;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label={`Navigate to ${title}`}
    >
      <div className="text-3xl" aria-hidden="true">{icon}</div>
      <h3 className={`text-lg font-bold transition-colors duration-200 ${accentClasses.split(" ")[0]}`}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      <span className={`mt-auto text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ${accentClasses.split(" ")[0]}`}>
        Explore →
      </span>
    </Link>
  );
}
