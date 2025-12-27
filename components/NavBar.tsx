'use client';

import Link from 'next/link';
import { useAuth } from '@/app/providers/AuthProvider';

export function NavBar() {
  const { user } = useAuth();

  return (
    <nav>
      <Link href="/">Edunancial</Link> |{' '}
      <Link href="/courses">Courses</Link> |{' '}
      <Link href="/checkout">Checkout</Link>{' '}
      {user ? (
        <>
          | <Link href="/dashboard">Dashboard</Link>
          {user.role === 'admin' && (
            <>
              {' '}
              | <Link href="/admin/courses">Admin</Link>
            </>
          )}
        </>
      ) : (
        <>
          | <Link href="/login">Login</Link>
        </>
      )}
    </nav>
  );
}
