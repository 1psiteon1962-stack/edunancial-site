// app/affiliate/[id]/page.tsx

export async function generateStaticParams() {
  // Static export requires this function.
  // Returning an empty array tells Next.js:
  // “Do not generate any /affiliate/[id] pages at build time.”
  return [];
}

export default function AffiliatePage() {
  // This page will never be statically generated.
  // It exists only to satisfy Next.js routing rules.
  return null;
}
