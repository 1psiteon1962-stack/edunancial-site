'use client';

import React from 'react';

type PaymentSectionProps = {
  title?: string;
  subtitle?: string;
  payHref?: string;
};

export default function PaymentSection({
  title = 'Ready to get started?',
  subtitle = 'Secure checkout will be available when you’re ready.',
  payHref,
}: PaymentSectionProps) {
  const handleClick = () => {
    if (!payHref) {
      alert('Checkout is not enabled yet.');
      return;
    }
    window.location.href = payHref;
  };

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-700">{subtitle}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
          >
            Pay
          </button>

          <p className="text-xs text-neutral-600">
            Payment providers are enabled after account activation.
          </p>
        </div>
      </div>
    </section>
  );
}
