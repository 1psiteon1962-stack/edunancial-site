const products = [
  { name: "Basic Membership", type: "Membership", na: "$0.00", caribbean: "$0.00", latam: "$0.00", europe: "$0.00", africa: "$0.00" },
  { name: "Gold Membership", type: "Membership", na: "$0.00", caribbean: "$0.00", latam: "$0.00", europe: "$0.00", africa: "$0.00" },
  { name: "Platinum Membership", type: "Membership", na: "$0.00", caribbean: "$0.00", latam: "$0.00", europe: "$0.00", africa: "$0.00" },
  { name: "Business is About Profit", type: "Book", na: "$0.00", caribbean: "$0.00", latam: "$0.00", europe: "$0.00", africa: "$0.00" },
  { name: "Red Term Pack", type: "Term Pack", na: "$0.00", caribbean: "$0.00", latam: "$0.00", europe: "$0.00", africa: "$0.00" },
];

export default function PricingAdministrationPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Commerce
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Pricing Administration
        </h1>
        <p className="mt-4 text-gray-400">
          Manage regional pricing for all Edunancial products and memberships.
        </p>
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold">Regional Price Matrix</h2>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors">
            Save All Prices
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                {["Product", "Type", "North America", "Caribbean", "Latin America", "Europe", "Africa"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold tracking-wider text-gray-400 uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.name} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 font-semibold">{p.name}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{p.type}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-gray-300">{p.na}</td>
                  <td className="px-5 py-4 font-mono text-gray-300">{p.caribbean}</td>
                  <td className="px-5 py-4 font-mono text-gray-300">{p.latam}</td>
                  <td className="px-5 py-4 font-mono text-gray-300">{p.europe}</td>
                  <td className="px-5 py-4 font-mono text-gray-300">{p.africa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
        <h2 className="font-bold mb-5">Add / Edit Product Price</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <input placeholder="Product Name" className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500" />
          <select className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm">
            <option>Select Type</option>
            <option>Membership</option>
            <option>Book</option>
            <option>Course</option>
            <option>Term Pack</option>
          </select>
          <input placeholder="North America Price" className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500" />
          <input placeholder="Caribbean Price" className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500" />
          <input placeholder="Latin America Price" className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500" />
          <input placeholder="Europe Price" className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500" />
          <input placeholder="Africa Price" className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500" />
        </div>
        <button className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-bold text-sm hover:bg-blue-700 transition-colors">
          Save Pricing
        </button>
      </div>

    </main>
  );
}
