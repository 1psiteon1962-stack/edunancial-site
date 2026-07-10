import type { CommunityStats } from "@/types/community";

interface CommunityStatsBarProps {
  stats: CommunityStats;
}

export default function CommunityStatsBar({ stats }: CommunityStatsBarProps) {
  const items = [
    { label: "Members", value: stats.totalMembers.toLocaleString(), icon: "👥" },
    { label: "Discussions", value: stats.totalDiscussions.toLocaleString(), icon: "💬" },
    { label: "Posts", value: stats.totalPosts.toLocaleString(), icon: "📝" },
    { label: "Active Today", value: stats.activeToday.toLocaleString(), icon: "🟢" },
    { label: "Weekly Growth", value: `+${stats.weeklyGrowth}%`, icon: "📈" },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      role="region"
      aria-label="Community statistics"
    >
      {items.map(({ label, value, icon }) => (
        <div key={label} className="rounded-xl bg-slate-800 p-5 text-center">
          <div className="text-2xl" aria-hidden="true">
            {icon}
          </div>
          <div className="mt-2 text-2xl font-black text-white">{value}</div>
          <div className="mt-1 text-xs text-slate-400 uppercase tracking-wider">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
