'use client';

import React from 'react';
import PaymentButton from './payments/PaymentButton';

export default function PaymentSection() {
  return (
    <section className="w-full max-w-xl mx-auto p-6 border rounded-lg bg-white shadow">
      <h2 className="text-2xl font-semibold mb-4">
        Access Premium Content
      </h2>

      <p className="text-gray-600 mb-6">
        Unlock advanced tools, guides, and educational resources.
      </p>

      <PaymentButton />
    </section>
  );
}
