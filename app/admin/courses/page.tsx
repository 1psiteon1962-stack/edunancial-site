import AdminGuard from '../../../components/AdminGuard';
import { getCourses } from '../../../lib/courses';

export default function AdminCoursesPage() {
  const courses = getCourses();

  return (
    <AdminGuard>
      <main style={{ padding: '2rem' }}>
        <h1>Admin – Courses</h1>
        <ul>
          {courses.map(course => (
            <li key={course.id}>
              <strong>{course.title}</strong>
              <p>{course.description}</p>
            </li>
          ))}
        </ul>
      </main>
    </AdminGuard>
  );
}
