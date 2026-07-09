import Link from "next/link";

const modules = [
  {
    title: "Lessons",
    desc: "Organize video and text lessons into structured learning paths.",
    href: "/admin/video-lessons",
    count: "0 lessons",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    title: "Quizzes",
    desc: "Create assessments and track student performance.",
    href: "/admin/quizzes",
    count: "0 quizzes",
    color: "bg-purple-500/10 text-purple-400",
  },
  {
    title: "Certificates",
    desc: "Automatically issue certificates on course completion.",
    href: "/admin/certificates",
    count: "0 issued",
    color: "bg-green-500/10 text-green-400",
  },
  {
    title: "Webinars",
    desc: "Schedule and manage live training sessions.",
    href: "/admin/webinars",
    count: "0 events",
    color: "bg-yellow-500/10 text-yellow-400",
  },
];

const courses = [
  { title: "Financial Literacy 101", lessons: 0, students: 0, status: "Draft" },
  { title: "Real Estate Fundamentals", lessons: 0, students: 0, status: "Draft" },
  { title: "Business Profitability", lessons: 0, students: 0, status: "Draft" },
];

export default function AdminCoursesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Content
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Course Administration
        </h1>
        <p className="mt-4 text-gray-400">
          Create and manage courses, lessons, quizzes, downloads and certificates.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Courses", value: courses.length },
          { label: "Published", value: 0 },
          { label: "Students Enrolled", value: 0 },
          { label: "Certificates Issued", value: 0 },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-4xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4 mb-10">
        {modules.map((mod) => (
          <Link key={mod.title} href={mod.href} className="rounded-2xl bg-[#101a2f] border border-white/10 p-5 hover:border-blue-500/50 transition-colors">
            <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${mod.color}`}>{mod.count}</span>
            <h3 className="mt-3 font-bold">{mod.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{mod.desc}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold">Course Catalog</h2>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors">
            Create Course
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                {["Title", "Lessons", "Students", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-400 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {courses.map((c) => (
                <tr key={c.title} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-semibold">{c.title}</td>
                  <td className="px-6 py-4 text-gray-400">{c.lessons}</td>
                  <td className="px-6 py-4 text-gray-400">{c.students}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-yellow-500/10 text-yellow-400 px-2.5 py-1 text-xs font-bold">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-400 hover:text-blue-300 text-xs font-semibold">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/courses" className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-sm hover:bg-blue-700 transition-colors">
          View Live Courses
        </Link>
        <Link href="/admin/video-lessons" className="rounded-xl border border-white/10 px-6 py-3 font-bold text-sm hover:bg-white/5 transition-colors">
          Manage Lessons
        </Link>
      </div>

    </main>
  );
}
