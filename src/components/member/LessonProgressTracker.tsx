"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/lib/authContext";

export default function LessonProgressTracker({
  courseId,
  lessonId,
  nextLessonHref,
}: {
  courseId: string;
  lessonId: string;
  nextLessonHref: string | null;
}) {
  const { user, csrfToken } = useAuth();
  const [completeLoading, setCompleteLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !csrfToken) {
      return;
    }

    void fetch("/api/member/progress/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ courseId, lessonId }),
    }).catch(() => undefined);
  }, [courseId, csrfToken, lessonId, user]);

  if (!user) {
    return null;
  }

  async function markComplete() {
    if (!csrfToken) {
      setMessage("Refresh the page and try again.");
      return;
    }

    setCompleteLoading(true);
    setMessage(null);
    const response = await fetch("/api/member/progress/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ courseId, lessonId }),
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    setCompleteLoading(false);
    setMessage(response.ok ? "Lesson progress saved." : payload.error ?? "Unable to save lesson progress.");
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Learning Progress</h2>
          <p className="mt-2 text-sm text-slate-300">
            Your current lesson and completion status are saved to your member account so you can continue on another device.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={markComplete}
            disabled={completeLoading}
            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-500 disabled:opacity-60"
          >
            {completeLoading ? "Saving…" : "Mark lesson complete"}
          </button>
          {nextLessonHref ? (
            <a
              href={nextLessonHref}
              className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800"
            >
              Continue to next lesson
            </a>
          ) : null}
        </div>
      </div>
      {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}
