import { getCmsEngine } from "@/lib/cms/engine";

const engine = getCmsEngine();

export default function CmsDashboardPage() {
  const dashboard = engine.getDashboard();

  const cards: Array<[string, number]> = [
    ["Total Lessons", dashboard.totalLessons],
    ["Published", dashboard.published],
    ["Draft", dashboard.draft],
    ["Needs Review", dashboard.needsReview],
    ["Needs Translation", dashboard.needsTranslation],
    ["Missing Localization", dashboard.missingLocalization],
    ["Pending Approvals", dashboard.pendingApprovals],
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">
      <h1 className="text-5xl font-black">Global Curriculum CMS</h1>
      <p className="text-gray-300 mt-3">Single source of truth for tracks, levels, lessons, localization, and versions.</p>

      <div className="grid gap-6 mt-10 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(([title, value]) => (
          <section key={title} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <p className="text-gray-400">{title}</p>
            <h2 className="mt-3 text-3xl font-black">{value}</h2>
          </section>
        ))}
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <h2 className="text-2xl font-bold">Recently Updated</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {dashboard.recentlyUpdated.map((item) => (
              <li key={item.lessonId}>
                <p className="font-semibold">{item.lessonId}</p>
                <p className="text-gray-400">{item.title || "Untitled lesson"}</p>
              </li>
            ))}
            {!dashboard.recentlyUpdated.length && <li className="text-gray-400">No lesson updates yet.</li>}
          </ul>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {dashboard.recentActivity.map((item, index) => (
              <li key={`${item.timestamp}-${index}`}>
                <p className="font-semibold">{item.action}</p>
                <p className="text-gray-400">{item.actor || "system"} • {item.lessonId || item.mediaId || "global"}</p>
              </li>
            ))}
            {!dashboard.recentActivity.length && <li className="text-gray-400">No activity yet.</li>}
          </ul>
        </article>
      </section>
    </main>
  );
}
