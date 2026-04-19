// app/(regions)/(root)/page.tsx

import { getRootPage } from "@/lib/velite";

interface PageData {
  title: string;
  description?: string; // ✅ make optional so build never breaks
  body: {
    code: string;
  };
}

export default async function Page() {
  const page: PageData = await getRootPage();

  return (
    <main>
      <h1>{page.title}</h1>

      {/* ✅ SAFE RENDER — no crash if missing */}
      {page.description && <p>{page.description}</p>}

      {/* Optional body rendering */}
      {page.body?.code && (
        <div
          dangerouslySetInnerHTML={{ __html: page.body.code }}
        />
      )}
    </main>
  );
}
