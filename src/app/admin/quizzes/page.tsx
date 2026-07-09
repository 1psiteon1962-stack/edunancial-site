export default function QuizManager() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Content
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Quiz Manager
        </h1>
        <p className="mt-3 text-gray-400">
          Build assessments, track scores and manage quiz completion records.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Quizzes", value: "0" },
          { label: "Published", value: "0" },
          { label: "Attempts (Total)", value: "0" },
          { label: "Pass Rate", value: "0%" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-4xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold">Quiz Library</h2>
          <button className="rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-sm hover:bg-blue-700 transition-colors">
            Create New Quiz
          </button>
        </div>
        <div className="text-center text-gray-500 text-sm py-10">
          No quizzes yet. Create your first quiz to get started.
        </div>
      </div>

    </main>
  );
}
