"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { useAuth } from "@/lib/authContext";
import { canAccessCurriculumLesson } from "@/lib/curriculum/access";

interface LessonNav {
  id: string;
  title: string;
}

interface Props {
  level: number;
  lessonNumber: number;
  isAdmin: boolean;
  /** True when the server determined the viewer cannot access this lesson. */
  serverLocked: boolean;
  lessonTitle: string;
  courseTitle: string;
  lessonSummary: string | null;
  courseId: string;
  membersOnlyLabel: string;
  membershipRequiredLabel: string;
  viewMembershipPlansLabel: string;
  /** Human-readable message describing the required tier (from server). */
  upgradeRequiredTier: string | null;
  prevLesson: LessonNav | null;
  nextLesson: LessonNav | null;
  coursesLabel: string;
  /** Full lesson page content — only present when server granted access. */
  children?: ReactNode;
}

export default function LessonAccessGate({
  level,
  lessonNumber,
  isAdmin,
  serverLocked,
  lessonTitle,
  courseTitle,
  lessonSummary,
  courseId,
  membersOnlyLabel,
  membershipRequiredLabel,
  viewMembershipPlansLabel,
  upgradeRequiredTier,
  prevLesson,
  nextLesson,
  coursesLabel,
  children,
}: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const refreshedRef = useRef(false);

  // If the server rendered a locked state but the client detects the user has
  // access (membership cookie may not have been set yet on first load), do a
  // single router.refresh() so the server can re-render with the now-set cookie.
  const clientCanAccess = canAccessCurriculumLesson({
    level,
    lessonNumber,
    membershipTier: user?.membershipTier,
    isAdmin,
  });

  useEffect(() => {
    if (
      serverLocked &&
      !loading &&
      clientCanAccess &&
      !refreshedRef.current
    ) {
      refreshedRef.current = true;
      // Small delay allows the membership cookie sync (set on auth mount) to
      // complete before we request a fresh server render.
      setTimeout(() => router.refresh(), 300);
    }
  }, [serverLocked, loading, clientCanAccess, router]);

  // Full lesson content was server-rendered — just display it.
  if (!serverLocked) {
    return <>{children}</>;
  }

  // Server locked + client is loading auth state → show brief loading UI.
  if (loading && !isAdmin) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white flex items-center justify-center px-6">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  // Server locked + client confirms access → refreshing (brief transition).
  if (clientCanAccess && !refreshedRef.current) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white flex items-center justify-center px-6">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  // Locked lesson: show title, summary, and upgrade CTA — no body content.
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-14">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/courses" className="hover:text-white">{coursesLabel}</Link>
          <span>/</span>
          <Link href={`/courses/${courseId}`} className="hover:text-white">{courseTitle}</Link>
          <span>/</span>
          <span className="text-slate-200">{lessonTitle}</span>
        </nav>

        <h1 className="text-4xl font-black md:text-5xl">{lessonTitle}</h1>
        {lessonSummary ? <p className="mt-4 text-lg text-slate-300">{lessonSummary}</p> : null}

        <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/50 p-10 text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-black">{membersOnlyLabel}</h2>
          {upgradeRequiredTier ? (
            <p className="text-slate-300 leading-relaxed">{upgradeRequiredTier}</p>
          ) : (
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">{lessonTitle}</strong> is part of{" "}
              <strong className="text-yellow-400">{courseTitle}</strong>. {membershipRequiredLabel}
            </p>
          )}
          <Link
            href="/membership"
            className="inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400 transition"
          >
            {viewMembershipPlansLabel}
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-3">
          {prevLesson ? (
            <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`} className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800">← {prevLesson.title}</Link>
          ) : <span />}
          {nextLesson ? (
            <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`} className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800">{nextLesson.title} →</Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
