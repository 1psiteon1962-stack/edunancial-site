"use client";

import { useEffect, useState } from "react";

export interface MemberCourseProgress {
  courseId: string;
  title: string;
  category: string;
  difficulty: string;
  lessonIds: string[];
  last_lesson_id: string | null;
  completed_lesson_ids: string[];
  progress_percent: number;
  last_position_seconds: number;
  completed: boolean;
  started_at: string;
  last_activity_at: string;
  completed_at: string | null;
  total_lessons: number;
  completed_lessons_count: number;
  next_lesson_id: string | null;
  continue_href: string;
}

export function useMemberProgress() {
  const [progress, setProgress] = useState<MemberCourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/member/progress", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as {
          progress?: MemberCourseProgress[];
          error?: string;
        };

        if (!active) {
          return;
        }

        if (!response.ok) {
          setError(payload.error ?? "Unable to load progress.");
          setProgress([]);
          return;
        }

        setProgress(payload.progress ?? []);
        setError(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  return { progress, loading, error };
}
