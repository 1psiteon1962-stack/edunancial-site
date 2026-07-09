export default function LeadCaptureAdmin() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Marketing
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Lead Capture
        </h1>
        <p className="mt-3 text-gray-400">
          Configure lead capture forms and connect them to lead magnets.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Active Forms", value: "0" },
          { label: "Leads Captured", value: "0" },
          { label: "Conversion Rate", value: "0%" },
          { label: "Lead Magnets", value: "0" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-4xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Create Capture Form</h2>
          <div className="space-y-4">
            <input
              placeholder="Form Name"
              className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500"
            />
            <select className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm">
              <option>Select Lead Magnet to Deliver</option>
            </select>
            <input
              placeholder="Delivery Email Address"
              className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500"
            />
            <div className="rounded-xl border-2 border-dashed border-white/20 p-6 text-center">
              <p className="text-gray-400 text-sm">Upload lead magnet PDF</p>
              <input type="file" accept=".pdf" className="mt-3 text-sm text-gray-400" />
            </div>
            <button className="w-full rounded-xl bg-blue-600 py-3 font-bold text-sm hover:bg-blue-700 transition-colors">
              Publish Lead Capture Form
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Active Forms</h2>
          <div className="text-center text-gray-500 text-sm py-12">
            No lead capture forms yet.
          </div>
        </div>

      </div>

    </main>
  );
}
