// app/affiliate/[id]/page.tsx

import { notFound } from "next/navigation";

/**
 * HARD STATIC CONFIG
 * Required for `output: 'export'`
 */
export const dynamic = "error";
export const dynamicParams = false;

/**
 * REQUIRED by Next.js static export
 * Returning an empty array is VALID and supported.
 */
export function generateStaticParams() {
  return [];
}

type Props = {
  params: {
    id: string;
  };
};

export default function AffiliatePage(_: Props) {
  notFound();
}
