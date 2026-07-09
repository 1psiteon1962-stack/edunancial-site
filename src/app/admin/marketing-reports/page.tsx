export default function MarketingReports() {
  const reports = [
    { title: "Subscribers Growth", desc: "Monthly new subscriber trends.", period: "All time" },
    { title: "Lead Magnets", desc: "Downloads and conversion by lead magnet.", period: "All time" },
    { title: "Revenue Attribution", desc: "Revenue by marketing channel.", period: "All time" },
    { title: "Profit by Campaign", desc: "Net profit attributed to each campaign.", period: "All time" },
    { title: "LTV by Cohort", desc: "Lifetime value grouped by acquisition month.", period: "All time" },
    { title: "CAC by Channel", desc: "Cost per acquisition by marketing channel.", period: "All time" },
    { title: "ROAS Report", desc: "Return on ad spend across paid channels.", period: "All time" },
    { title: "Conversion Funnel", desc: "Visitor to paid customer conversion steps.", period: "All time" },
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Marketing
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Marketing Reports
        </h1>
        <p className="mt-3 text-gray-400">
          Detailed reports on subscriber growth, revenue attribution and campaign performance.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {reports.map((report) => (
          <div key={report.title} className="rounded-2xl bg-[#101a2f] border border-white/10 p-5">
            <h2 className="font-bold">{report.title}</h2>
            <p className="mt-1 text-sm text-gray-400">{report.desc}</p>
            <p className="mt-3 text-xs text-gray-500">{report.period}</p>
            <button className="mt-4 rounded-lg bg-blue-600/10 text-blue-400 px-3 py-1.5 text-xs font-semibold hover:bg-blue-600/20 transition-colors">
              View Report
            </button>
          </div>
        ))}
      </div>

    </main>
  );
}
