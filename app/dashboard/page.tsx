'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        Logged in as <strong>{user.email}</strong> (
        {user.role.toUpperCase()})
      </p>

      {user.role === 'admin' ? (
        <section>
          <h2>Admin Panel</h2>
          <p>Manage courses, users, and revenue.</p>
        </section>
      ) : (
        <section>
          <h2>My Courses</h2>
          <p>Your enrolled courses will appear here.</p>
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
