"use client";

interface PassportPrintButtonProps {
  label?: string;
  className?: string;
}

export default function PassportPrintButton({
  label = "Download PDF passport",
  className,
}: PassportPrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        "rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500"
      }
      aria-label={`${label} using your browser print dialog`}
    >
      {label}
    </button>
  );
}
