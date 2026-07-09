export default function VideoLessonsAdmin() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Content
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Video Lesson Manager
        </h1>
        <p className="mt-3 text-gray-400">
          Create, organize and publish video lessons for all courses.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Lessons", value: "0" },
          { label: "Published", value: "0" },
          { label: "Total Views", value: "0" },
          { label: "Avg. Completion", value: "0%" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-4xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Add New Lesson</h2>
          <div className="space-y-4">
            <input
              placeholder="Lesson Title"
              className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500"
            />
            <textarea
              rows={3}
              placeholder="Lesson Description"
              className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500"
            />
            <input
              placeholder="YouTube URL or Video URL"
              className="w-full rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <select className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm">
                <option>Select Course</option>
              </select>
              <input
                type="number"
                placeholder="Order"
                className="rounded-xl bg-[#08101f] border border-white/10 px-4 py-3 text-sm placeholder:text-gray-500"
              />
            </div>
            <button className="w-full rounded-xl bg-blue-600 py-3 font-bold text-sm hover:bg-blue-700 transition-colors">
              Save Lesson
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <h2 className="font-bold mb-5">Lesson Library</h2>
          <div className="text-center text-gray-500 text-sm py-12">
            No lessons yet. Add your first video lesson to get started.
          </div>
        </div>

      </div>

    </main>
  );
}
