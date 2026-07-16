import Link from "next/link";

const managementAreas = [
  {
    title: "Course management console",
    description:
      "Use the upload and review portal to create course batches, validate files, and connect approved content without changing application code.",
    href: "/admin/content",
    cta: "Open content workspace",
  },
  {
    title: "Course, module, and lesson builder",
    description:
      "Manage curriculum structure, localization workflow, publishing state, and version history from the CMS dashboard.",
    href: "/admin/cms",
    cta: "Open CMS dashboard",
  },
  {
    title: "Resource library",
    description:
      "Manage reusable PDFs, videos, downloads, workbooks, and supporting assets in the library workspace.",
    href: "/admin/library",
    cta: "Open library",
  },
];

const builderCapabilities = [
  "Course title, subtitle, description, instructor, difficulty, category, language, and course image metadata",
  "Unlimited courses, modules, lessons, chapters, sections, downloads, assessments, and certificates",
  "Free, paid, membership-only, drip-release, scheduled, draft, published, hidden, and archived delivery states",
  "RED, WHITE, and BLUE learning paths with localization and version-review workflow support",
];

const uploadCapabilities = [
  "MP4 videos and audio assets",
  "YouTube, documents, PDF, DOCX, PowerPoint, HTML, and Markdown lesson sources",
  "Images, worksheets, workbooks, ZIP packages, and downloadable resources",
  "Validation, metadata capture, classification, extraction, duplicate detection, and review staging",
];

export default function AdminCoursesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Administrator course dashboard</p>
        <h1 className="mt-4 text-5xl font-black sm:text-6xl">
          Scalable course operations
        </h1>
        <p className="mt-6 max-w-4xl text-lg text-gray-300 sm:text-xl">
          Upload, review, structure, publish, and maintain Edunancial course content from one operational hub. The existing CMS and content pipeline support ongoing course updates without direct application code edits.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {managementAreas.map((area) => (
            <article key={area.title} className="rounded-3xl border border-white/10 bg-[#151b2d] p-8">
              <h2 className="text-3xl font-black">{area.title}</h2>
              <p className="mt-5 text-gray-300">{area.description}</p>
              <Link
                href={area.href}
                className="mt-8 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500"
              >
                {area.cta}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-8 xl:grid-cols-[1.2fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-8">
            <h2 className="text-3xl font-black">Publishing and builder coverage</h2>
            <ul className="mt-6 space-y-4 text-gray-300">
              {builderCapabilities.map((capability) => (
                <li key={capability} className="flex gap-3">
                  <span className="mt-1 text-blue-300">•</span>
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-8">
            <h2 className="text-3xl font-black">Upload system coverage</h2>
            <ul className="mt-6 space-y-4 text-gray-300">
              {uploadCapabilities.map((capability) => (
                <li key={capability} className="flex gap-3">
                  <span className="mt-1 text-blue-300">•</span>
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/admin/content/upload" className="rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-500">
            Upload new course content
          </Link>
          <Link href="/courses" className="rounded-xl border border-white/15 px-8 py-4 font-bold text-slate-200 hover:border-white/30">
            View live courses
          </Link>
        </div>
      </section>
    </main>
  );
}
