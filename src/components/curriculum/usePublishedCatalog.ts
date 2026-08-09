"use client";

import { useEffect, useState } from "react";

type CatalogCourse = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  color: string;
  isFree: boolean;
  isFeatured: boolean;
  tags: string[];
  lessons: string[];
};

type CatalogLesson = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: string;
};

type CatalogQuiz = {
  id: string;
  title: string;
  courseId: string | null;
  questions: Array<{ id: string; question: string; options: string[]; correctIndex: number; explanation: string }>;
  passingScore: number;
};

type CatalogState = {
  courseList: CatalogCourse[];
  lessonList: CatalogLesson[];
  quizList: CatalogQuiz[];
  courses: Record<string, CatalogCourse>;
  lessons: Record<string, CatalogLesson>;
  quizzes: Record<string, CatalogQuiz>;
  categories: string[];
  categoryColors: Record<string, string>;
};

const EMPTY_STATE: CatalogState = {
  courseList: [],
  lessonList: [],
  quizList: [],
  courses: {},
  lessons: {},
  quizzes: {},
  categories: [],
  categoryColors: {},
};

export function usePublishedCatalog() {
  const [data, setData] = useState<CatalogState>(EMPTY_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/public/curriculum/catalog", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as CatalogState;
        if (active) {
          setData({
            ...EMPTY_STATE,
            ...payload,
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { ...data, loading };
}
