export default function UploadManagerPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Content
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Upload Manager
        </h1>
        <p className="mt-3 text-gray-400">
          Upload books, courses, PDFs, audio books and marketing materials.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Files Uploaded", value: "0" },
          { label: "Total Size", value: "0 MB" },
          { label: "Books", value: "0" },
          { label: "Audio Books", value: "0" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-4xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Upload New File</h2>
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-dashed border-white/20 p-8 text-center">
              <p className="text-gray-400 text-sm">Drop files here or click to select</p>
              <input type="file" className="mt-4 text-sm text-gray-400" />
            </div>
            <select className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm">
              <option>Select Content Type</option>
              <option>Book (PDF)</option>
              <option>Course (Video)</option>
              <option>Audio Book (MP3)</option>
              <option>Workbook (PDF)</option>
              <option>Financial Terms Pack</option>
              <option>Marketing Asset</option>
            </select>
            <select className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm">
              <option>Assign to Region</option>
              <option>All Regions</option>
              <option>North America</option>
              <option>Caribbean</option>
              <option>Latin America</option>
              <option>Europe</option>
              <option>Africa</option>
            </select>
            <button className="w-full rounded-xl bg-blue-600 py-3 font-bold text-sm hover:bg-blue-700 transition-colors">
              Upload
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Recent Uploads</h2>
          <div className="text-center text-gray-500 text-sm py-12">
            No uploads yet.
          </div>
        </div>

      </div>

    </main>
  );
}
