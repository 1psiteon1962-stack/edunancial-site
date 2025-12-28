// app/affiliate/[id]/page.tsx

import { notFound } from "next/navigation";

/**
 * REQUIRED for `output: 'export'`
 * This tells Next.js which affiliate pages exist at build time.
 *
 * Empty array = no affiliate pages are prebuilt.
 * The route will NOT error during export.
 */
export async function generateStaticParams() {
  return [];
}

/**
 * Prevent Next from trying to infer dynamic params
 */
export const dynamicParams = false;

type PageProps = {
  params: {
    id: string;
  };
};

export default function AffiliatePage({ params }: PageProps) {
  // Since no IDs are statically generated, this route should never render.
  notFound();
}
