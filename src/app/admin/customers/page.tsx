const stats = [
  { title: "Total Customers", value: "0" },
  { title: "Active Members", value: "0" },
  { title: "Monthly Subscribers", value: "0" },
  { title: "Lifetime Customers", value: "0" },
];

const tableHeaders = ["Name", "Email", "Plan", "Region", "Joined", "Status", "Actions"];

export default function CustomerAdministrationPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Commerce
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Customer Administration
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Search, manage and monitor all Edunancial customers worldwide.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {stats.map((item) => (
          <div key={item.title} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{item.title}</p>
            <h2 className="text-4xl font-black mt-3">{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center gap-4">
          <input
            placeholder="Search customer by name or email..."
            className="flex-1 min-w-0 rounded-xl bg-[#08101f] border border-white/10 px-4 py-2.5 text-sm placeholder:text-gray-500"
          />
          <div className="flex gap-3">
            <select className="rounded-xl bg-[#08101f] border border-white/10 px-3 py-2.5 text-sm">
              <option>All Plans</option>
              <option>Basic</option>
              <option>Gold</option>
              <option>Platinum</option>
            </select>
            <select className="rounded-xl bg-[#08101f] border border-white/10 px-3 py-2.5 text-sm">
              <option>All Regions</option>
              <option>North America</option>
              <option>Caribbean</option>
              <option>Latin America</option>
              <option>Europe</option>
            </select>
            <button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold hover:bg-blue-700 transition-colors">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                {tableHeaders.map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-400 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={tableHeaders.length} className="px-6 py-12 text-center text-gray-500">
                  No customers yet. Customers will appear here once they register.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
