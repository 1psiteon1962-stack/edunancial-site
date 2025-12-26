'use client';

import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevents Next.js from prerendering browser-only logic
  if (!mounted) {
    return null; // or a loading spinner
  }

  // ✅ SAFE: browser-only APIs can be used below
  // Example:
  // const cart = localStorage.getItem('cart');

  return (
    <main>
      <h1>Checkout</h1>
      {/* Your existing checkout UI goes here */}
    </main>
  );
}
