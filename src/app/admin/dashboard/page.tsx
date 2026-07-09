import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminDataService } from "@/lib/admin/dataService";

export default async function DashboardPage() {
  const metrics = await adminDataService.dashboard.getMetrics();

  const stats: Array<{
    title: string;
    value: string;
    change: string;
    changeType: "up" | "down";
  }> = [
    { title: "Total Members", value: metrics.totalMembers.toLocaleString(), change: "+8.2%", changeType: "up" },
    { title: "Active Members", value: metrics.activeMembers.toLocaleString(), change: "+3.1%", changeType: "up" },
    { title: "New Registrations", value: `${metrics.newRegistrations} this month`, change: "+12.4%", changeType: "up" },
    { title: "Subscription Revenue", value: `$${metrics.subscriptionRevenue.toLocaleString()}`, change: "+15.3%", changeType: "up" },
    { title: "Course Enrollments", value: metrics.courseEnrollments.toLocaleString(), change: "+22.7%", changeType: "up" },
    { title: "Course Completions", value: metrics.courseCompletions.toLocaleString(), change: "+18.4%", changeType: "up" },
    { title: "Calculator Usage", value: metrics.calculatorUsage.toLocaleString(), change: "+31.2%", changeType: "up" },
    { title: "Website Traffic", value: metrics.websiteTraffic.toLocaleString(), change: "+9.8%", changeType: "up" },
    { title: "Support Tickets", value: `${metrics.supportTickets} open`, change: "-5.1%", changeType: "down" },
    { title: "Recent Alerts", value: "3", change: "0%", changeType: "up" },
  ];

  const quickActions = [
    { label: "+ Add User", href: "/admin/users" },
    { label: "+ Create Course", href: "/admin/courses" },
    { label: "+ New Content", href: "/admin/cms" },
    { label: "View Reports", href: "/admin/marketing-reports" },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Executive Dashboard"
        description="A real-time snapshot of members, revenue, learning activity, and platform health across Edunancial."
        actions={
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                {action.label}
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <section>
        <h2 className="text-2xl font-black text-white">Recent Activity</h2>
        <p className="mt-1 text-sm text-gray-400">
          Last {metrics.recentActivity.length} administrative actions across the platform.
        </p>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#101a2f]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-gray-400">
                <th scope="col" className="px-4 py-3 font-bold">Admin</th>
                <th scope="col" className="px-4 py-3 font-bold">Action</th>
                <th scope="col" className="px-4 py-3 font-bold">Resource</th>
                <th scope="col" className="px-4 py-3 font-bold">Severity</th>
                <th scope="col" className="px-4 py-3 font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentActivity.map((entry) => (
                <tr key={entry.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-gray-200">
                    <div className="font-semibold text-white">{entry.adminName}</div>
                    <div className="text-xs text-gray-500">{entry.adminEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-200">{entry.action}</td>
                  <td className="px-4 py-3 capitalize text-gray-200">{entry.resource}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={entry.severity} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
