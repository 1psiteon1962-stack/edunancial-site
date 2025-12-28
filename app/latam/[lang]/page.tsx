// app/latam/[lang]/page.tsx

import { notFound } from "next/navigation";
import {
  resolveCopy,
  regionLanguages,
  Language,
  Region,
} from "@/lib/core";

type PageParams = {
  params: {
    lang: string;
  };
};

const REGION: Region = "LATAM";

export default function Page({ params }: PageParams) {
  const allowedLanguages = regionLanguages[REGION];

  // Runtime + type-safe guard
  if (!allowedLanguages.includes(params.lang as Language)) {
    notFound();
  }

  const language = params.lang as Language;

  const copy =
    resolveCopy(REGION, language) ??
    resolveCopy(REGION, "es");

  if (!copy) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">LATAM</h1>
      <p className="mt-4 text-gray-700">
        Resolved content key: <strong>{copy}</strong>
      </p>
    </main>
  );
}
