"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useAuth } from "@/lib/authContext";
import { canAccessCurriculumLesson } from "@/lib/curriculum/access";

interface Props {
  level: number;
  lessonNumber: number;
  isAdmin: boolean;
  lessonTitle: string;
  courseTitle: string;
  membersOnlyLabel: string;
  membershipRequiredLabel: string;
  viewMembershipPlansLabel: string;
  children: ReactNode;
}

export default function LessonAccessGate({
  level,
  lessonNumber,
  isAdmin,
  lessonTitle,
  courseTitle,
  membersOnlyLabel,
  membershipRequiredLabel,
  viewMembershipPlansLabel,
  children,
}: Props) {
  const { user, loading } = useAuth();

  if (loading && !isAdmin) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white flex items-center justify-center px-6">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  const canAccess = canAccessCurriculumLesson({
    level,
    lessonNumber,
    membershipTier: user?.membershipTier,
    isAdmin,
  });

  if (!canAccess) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white flex flex-col items-center justify-center px-6">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h1 className="text-3xl font-black">{membersOnlyLabel}</h1>
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-white">{lessonTitle}</strong> is part of{" "}
            <strong className="text-yellow-400">{courseTitle}</strong>. {membershipRequiredLabel}
          </p>
          <Link
            href="/membership"
            className="inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400 transition"
          >
            {viewMembershipPlansLabel}
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
