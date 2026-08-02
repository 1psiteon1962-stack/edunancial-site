import type { Metadata } from "next";
import { cookies } from "next/headers";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import AddLessonClient from "./AddLessonClient";

export const metadata: Metadata = {
  title: "Add Lesson | Curriculum | Edunancial Admin",
  robots: { index: false, follow: false },
};

export default async function AddLessonPage() {
  await requireAdminPageSession();
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get("edunancial_admin_csrf")?.value ?? "";

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <AddLessonClient csrfToken={csrfToken} />
      </section>
    </main>
  );
}
