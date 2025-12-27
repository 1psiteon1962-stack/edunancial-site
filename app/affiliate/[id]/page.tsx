// app/affiliate/[id]/page.tsx

import { notFound } from "next/navigation";

type PageProps = {
  params: {
    id: string;
  };
};

export default function AffiliatePage({ params }: PageProps) {
  const { id } = params;

  // Basic guard — expand later if needed
  if (!id) {
    notFound();
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Affiliate Portal</h1>

      <p className="text-gray-700">
        Affiliate ID: <strong>{id}</strong>
      </p>

      <p className="mt-4 text-sm text-gray-500">
        This page is reserved for approved affiliates.
      </p>
    </main>
  );
}
