const cards = [
  ["Gross Revenue", "$0.00"],
  ["Net Revenue", "$0.00"],
  ["Expenses", "$0.00"],
  ["Net Profit", "$0.00"],
  ["Gross Margin", "0%"],
  ["Net Margin", "0%"],
  ["MoM Growth", "0%"],
  ["YoY Growth", "0%"],
];

const expenseCategories = [
  { category: "Platform & Hosting", amount: "$0.00", pct: "0%" },
  { category: "Marketing & Ads", amount: "$0.00", pct: "0%" },
  { category: "Payment Fees", amount: "$0.00", pct: "0%" },
  { category: "Content Production", amount: "$0.00", pct: "0%" },
  { category: "Software & Tools", amount: "$0.00", pct: "0%" },
];

export default function ProfitDashboard() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Executive
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Profit Dashboard
        </h1>
        <p className="mt-3 text-gray-400">
          Revenue, expenses and profitability across all product lines.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {cards.map(([title, value]) => (
          <div key={title} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-slate-400 text-sm">{title}</p>
            <h2 className="text-3xl font-bold mt-3">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Revenue by Product Line</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b border-white/10">
                <th className="text-left pb-3">Product</th>
                <th className="text-right pb-3">Revenue</th>
                <th className="text-right pb-3">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { product: "Books", revenue: "$0", margin: "0%" },
                { product: "Memberships", revenue: "$0", margin: "0%" },
                { product: "Courses", revenue: "$0", margin: "0%" },
                { product: "Audio Books", revenue: "$0", margin: "0%" },
                { product: "Term Packs", revenue: "$0", margin: "0%" },
              ].map((row) => (
                <tr key={row.product}>
                  <td className="py-3 text-gray-200">{row.product}</td>
                  <td className="py-3 text-right font-semibold">{row.revenue}</td>
                  <td className="py-3 text-right text-gray-400">{row.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Expense Breakdown</h2>
          <ul className="space-y-3">
            {expenseCategories.map((e) => (
              <li key={e.category} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{e.category}</span>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{e.amount}</span>
                  <span className="text-gray-400 w-10 text-right">{e.pct}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </main>
  );
}
