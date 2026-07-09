export default function EmailListAdmin() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Marketing
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Email List
        </h1>
        <p className="mt-3 text-gray-400">
          Manage and segment your email subscriber database.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Subscribers", value: "0" },
          { label: "Active", value: "0" },
          { label: "Unsubscribed", value: "0" },
          { label: "Lists", value: "0" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-4xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center gap-4">
          <input
            placeholder="Search subscribers..."
            className="flex-1 min-w-0 rounded-xl bg-[#08101f] border border-white/10 px-4 py-2.5 text-sm placeholder:text-gray-500"
          />
          <select className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-2.5 text-sm">
            <option>All Lists</option>
          </select>
          <button className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold hover:bg-green-700 transition-colors">
            Export CSV
          </button>
        </div>
        <div className="px-6 py-12 text-center text-gray-500">
          No subscribers yet. Subscribers will appear here once they sign up.
        </div>
      </div>

    </main>
  );
}
