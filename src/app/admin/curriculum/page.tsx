import Link from "next/link";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { requireAdminPageSession } from "@/lib/admin-content/auth";

export const metadata = { title: "Curriculum Manager | Edunancial Admin" };

interface LessonEntry {
  id: string;
  track: string;
  level: number;
  number: number;
  title: string;
  path: string;
  publicUrl: string;
}

async function loadRedL1Lessons(): Promise<LessonEntry[]> {
  const dir = join(process.cwd(), "content/curriculum/RED/L1");
  const entries: LessonEntry[] = [];
  let files: string[] = [];
  try {
    files = await readdir(dir);
  } catch {
    return entries;
  }

  for (const file of files.sort()) {
    if (!file.endsWith(".md")) continue;
    const id = file.replace(".md", "");
    // Skip manifests and batch verification files
    if (!id.match(/^RED-L\d-\d{3}$/)) continue;
    const [, , numStr] = id.split("-");
    const level = 1;
    const number = parseInt(numStr, 10);

    // Parse title from front-matter
    let title = id;
    try {
      const content = await readFile(join(dir, file), "utf8");
      const titleMatch = content.match(/^title:\s*"?(.+?)"?\s*$/m);
      if (titleMatch) title = titleMatch[1];
    } catch {
      // Use id as fallback
    }

    // Map curriculum ID to course-platform lesson ID
    const paddedNum = String(number).padStart(3, "0");
    const courseNum = `${level}${String(number).padStart(2, "0")}`;

    entries.push({
      id,
      track: "RED",
      level,
      number,
      title,
      path: `content/curriculum/RED/L${level}/${id}.md`,
      publicUrl: `/courses/red-level-1/lessons/red-${courseNum}`,
    });
  }
  return entries;
}

export default async function AdminCurriculumPage() {
  const session = await requireAdminPageSession();
  const lessons = await loadRedL1Lessons();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Admin › Curriculum</p>
            <h1 className="mt-2 text-4xl font-black">Curriculum Manager</h1>
            <p className="mt-2 text-slate-400">
              Manage published lesson content. Viewing as{" "}
              <strong className="text-white">{session.email}</strong> ({session.role}).
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-slate-300 hover:border-white/40"
          >
            ← Admin Home
          </Link>
        </div>

        {/* RED Level 1 */}
        <div className="mt-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="rounded-full bg-red-700 px-4 py-1 text-sm font-bold">RED</span>
            <h2 className="text-2xl font-black">Level 1 — Real Estate Foundations</h2>
            <span className="rounded-full bg-green-700/40 border border-green-600/40 px-3 py-0.5 text-xs font-semibold text-green-300">
              {lessons.length}/10 Published
            </span>
          </div>

          {lessons.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-12 text-center">
              <p className="text-xl font-bold text-white">No lessons found</p>
              <p className="mt-3 text-slate-400 text-sm">
                Lesson files should be placed in{" "}
                <code className="text-yellow-400">content/curriculum/RED/L1/RED-L1-001.md</code> through{" "}
                <code className="text-yellow-400">RED-L1-010.md</code>.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101a2f]">
              <div className="grid grid-cols-[3rem_1fr_auto_auto] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>#</span>
                <span>Lesson</span>
                <span>Preview</span>
                <span>Edit</span>
              </div>
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="grid grid-cols-[3rem_1fr_auto_auto] gap-4 items-center border-b border-white/5 px-6 py-4 text-sm last:border-b-0"
                >
                  <span className="font-mono text-slate-500 text-xs">{String(lesson.number).padStart(2, "0")}</span>
                  <div>
                    <p className="font-semibold text-white">{lesson.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 font-mono">{lesson.id}</p>
                  </div>
                  <Link
                    href={lesson.publicUrl}
                    target="_blank"
                    className="rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-slate-400 whitespace-nowrap"
                  >
                    Preview ↗
                  </Link>
                  <Link
                    href={`/admin/curriculum/lessons/${lesson.id}`}
                    className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 whitespace-nowrap"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Placeholder for future tracks */}
        <div className="mt-12 rounded-2xl border border-white/5 bg-[#0c1422] p-8 text-center">
          <p className="font-bold text-slate-500">WHITE 101–110 and BLUE 101–110</p>
          <p className="mt-2 text-sm text-slate-600">
            Not yet released. Will appear here once RED 101–110 has been verified on production.
          </p>
        </div>
      </section>
    </main>
  );
}
