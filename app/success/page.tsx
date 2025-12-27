'use client';

import { useEffect } from 'react';
import { useCart } from '@/app/providers/CartProvider';
import { useEnrollment } from '@/app/providers/EnrollmentProvider';

export default function SuccessPage() {
  const { items, clearCart } = useCart();
  const { enroll } = useEnrollment();

  useEffect(() => {
    items.forEach(item => enroll(item.id));
    clearCart();
  }, [items, enroll, clearCart]);

  return (
    <main>
      <h1>Payment Successful</h1>
      <p>You are now enrolled in your courses.</p>
    </main>
  );
}
