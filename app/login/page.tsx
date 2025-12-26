'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { loginAsStudent, loginAsAdmin } = useAuth();
  const router = useRouter();

  return (
    <main>
      <h1>Login</h1>

      <button
        onClick={() => {
          loginAsStudent();
          router.push('/dashboard');
        }}
      >
        Login as Student
      </button>

      <br />
      <br />

      <button
        onClick={() => {
          loginAsAdmin();
          router.push('/dashboard');
        }}
      >
        Login as Admin
      </button>
    </main>
  );
}
