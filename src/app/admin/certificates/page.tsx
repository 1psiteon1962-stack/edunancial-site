export default function CertificateManager() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Content
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Certificate Manager
        </h1>
        <p className="mt-3 text-gray-400">
          Issue, track and verify completion certificates for courses and programs.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Certificates Issued", value: "0" },
          { label: "This Month", value: "0" },
          { label: "Unique Recipients", value: "0" },
          { label: "Verification Requests", value: "0" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-4xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Generate Certificate</h2>
          <div className="space-y-4">
            <input
              placeholder="Student Name"
              className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500"
            />
            <select className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm">
              <option>Select Course / Program</option>
            </select>
            <input
              type="date"
              className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm"
            />
            <button className="w-full rounded-xl bg-green-600 py-3 font-bold text-sm hover:bg-green-700 transition-colors">
              Generate Certificate
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Recently Issued</h2>
          <div className="text-center text-gray-500 text-sm py-12">
            No certificates issued yet.
          </div>
        </div>

      </div>

    </main>
  );
}
