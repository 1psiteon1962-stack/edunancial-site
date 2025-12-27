'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type EnrollmentContextType = {
  enrolledCourseIds: string[];
  enroll: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
};

const EnrollmentContext = createContext<EnrollmentContextType | null>(null);

export function EnrollmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('enrollments');
    if (stored) {
      setEnrolledCourseIds(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'enrollments',
      JSON.stringify(enrolledCourseIds)
    );
  }, [enrolledCourseIds]);

  const enroll = (courseId: string) => {
    setEnrolledCourseIds(prev =>
      prev.includes(courseId) ? prev : [...prev, courseId]
    );
  };

  const isEnrolled = (courseId: string) =>
    enrolledCourseIds.includes(courseId);

  return (
    <EnrollmentContext.Provider
      value={{ enrolledCourseIds, enroll, isEnrolled }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) {
    throw new Error(
      'useEnrollment must be used within EnrollmentProvider'
    );
  }
  return ctx;
}
