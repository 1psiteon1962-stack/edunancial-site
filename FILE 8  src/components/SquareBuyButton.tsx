"use client";

type Props = {
  checkoutUrl: string;
  label?: string;
};

export default function SquareBuyButton({
  checkoutUrl,
  label = "Buy Now",
}: Props) {
  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 transition px-6 py-3 font-bold text-white"
    >
      {label}
    </a>
  );
}
