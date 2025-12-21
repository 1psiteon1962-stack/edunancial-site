'use client';

import React from 'react';
import PaymentButton from './payments/PaymentButton';

type PaymentSectionProps = {
  title?: string;
  subtitle?: string;
  payHref?: string;     // optional checkout URL (leave blank if not using)
};

export default function PaymentSection({
  title = 'Ready to get started?',
  subtitle = 'Secure checkout is available when you’re ready.',
  payHref,
}: PaymentSectionProps) {
  return (
    <section className="w-full">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-700">{subtitle}</p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PaymentButton
            label="Pay"
            href={payHref}
            onClick={() => {
              // If you don't have a checkout URL yet, this prevents a broken click.
              // Replace this later when you wire up payment.
              if (!payHref) {
                alert('Checkout is not enabled yet.');
              }
            }}
          />

          <p className="text-xs text-neutral-600">
            (Payment providers are not shown here by design.)
          </p>
        </div>
      </div>
    </section>
  );
}
