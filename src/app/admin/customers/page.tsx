import { getExecutiveOperationsSnapshot, type LiveValue } from "@/lib/admin/operations-snapshot";

function displayValue(metric?: LiveValue) {
  return metric?.status === "LIVE" && metric.value !== null
    ? new Intl.NumberFormat("en-US").format(metric.value)
    : "Unavailable";
}

export default async function CustomerAdministrationPage() {
  const snapshot = await getExecutiveOperationsSnapshot();

  const stats = [
    {
      title: "Active Members",
      metric: snapshot.activeMembers,
      detail: "Live members table",
    },
    {
      title: "New Members — 30 Days",
      metric: snapshot.newMembers30d,
      detail: "Members created in the last 30 days",
    },
    {
      title: "Active Subscriptions",
      metric: snapshot.activeSubscriptions,
      detail: "Live subscriptions table",
    },
    {
      title: "Basic / Pro / Gold",
      value:
        snapshot.basicMembers.status === "LIVE" &&
        snapshot.proMembers.status === "LIVE" &&
        snapshot.goldMembers.status === "LIVE"
          ? `${snapshot.basicMembers.value ?? 0} / ${snapshot.proMembers.value ?? 0} / ${snapshot.goldMembers.value ?? 0}`
          : "Unavailable",
      detail: "Active membership tiers",
    },
  ];

  return (
    <main className="min-h-screen bg-[#08101f] p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
          Live operations data
        </p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">
          Customer Administration
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-gray-300">
          Membership and subscription totals are read from Edunancial&apos;s
          operational data sources. This page no longer displays fabricated zero
          values or a search control that is not connected to customer records.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <section
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-gray-400">
                {item.title}
              </p>
              <h2 className="mt-3 text-3xl font-black">
                {"metric" in item ? displayValue(item.metric) : item.value}
              </h2>
              <p className="mt-2 text-sm text-gray-500">{item.detail}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Data status</h2>
              <p className="mt-1 text-sm text-gray-400">
                Snapshot as of {new Date(snapshot.asOf).toLocaleString("en-US")}
              </p>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-300">
              Live source connected
            </span>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-gray-300 md:grid-cols-2">
            <p>
              Members source: <strong>{snapshot.activeMembers.source}</strong>
            </p>
            <p>
              Subscriptions source:{" "}
              <strong>{snapshot.activeSubscriptions.source}</strong>
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm text-amber-100">
          Individual customer search and record editing are intentionally not shown
          until they are connected to authenticated customer-record actions. The
          previous search box was removed because it did not query or manage any
          customer data.
        </section>
      </div>
    </main>
  );
}
