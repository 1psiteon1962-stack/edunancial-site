'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useEnrollment } from '@/app/providers/EnrollmentProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { enrolledCourseIds } = useEnrollment();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        {user.email} ({user.role})
      </p>

      {user.role === 'admin' ? (
        <section>
          <h2>Admin Panel</h2>
          <p>Course and user management coming next.</p>
        </section>
      ) : (
        <section>
          <h2>My Courses</h2>
          {enrolledCourseIds.length === 0 ? (
            <p>No enrollments yet.</p>
          ) : (
            <ul>
              {enrolledCourseIds.map(id => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <button
        onClick={() => {
          logout();
          router.push('/');
        }}
      >
        Logout
      </button>
    </main>
  );
}
