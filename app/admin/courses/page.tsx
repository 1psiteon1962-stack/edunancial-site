'use client';

import { AdminGuard } from '@/components/AdminGuard';
import { courses } from '@/lib/courses';

export default function AdminCoursesPage() {
  return (
    <AdminGuard>
      <main>
        <h1>Admin – Manage Courses</h1>

        <ul>
          {courses.map(course => (
            <li key={course.id}>
              <strong>{course.title}</strong> — ${course.price}
              <br />
              <small>{course.level}</small>
            </li>
          ))}
        </ul>

        <p>
          (Editing, creation, and deletion hooks will be added next.)
        </p>
      </main>
    </AdminGuard>
  );
}
