'use client';

import React from 'react';

type PaymentButtonProps = {
  label?: string;                 // defaults to "Pay"
  href?: string;                  // if provided, navigates to a link
  onClick?: () => void;           // optional callback
  disabled?: boolean;
  className?: string;
};

export default function PaymentButton({
  label = 'Pay',
  href,
  onClick,
  disabled = false,
  className = '',
}: PaymentButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold ' +
    'transition focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
    (disabled
      ? 'opacity-60 cursor-not-allowed bg-neutral-300 text-neutral-700'
      : 'bg-black text-white hover:opacity-90 focus:ring-neutral-400');

  // If you want it to go to a checkout URL, pass href.
  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
        className={`${base} ${className}`}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!disabled) onClick?.();
      }}
      className={`${base} ${className}`}
    >
      {label}
    </button>
  );
}
