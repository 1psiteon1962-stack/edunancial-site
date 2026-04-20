// app/(regions)/(root)/page.tsx

import { getRootPageData } from "@/lib/content-resolver";

/**
 * We REMOVE the incorrect PageData typing
 * and let TypeScript infer the correct return type (RootPageData)
 */

export default async function Page() {
  const page = await getRootPageData();

  return (
    <main>
      <h1>{page.title}</h1>

      {/* Safely render body ONLY if it exists */}
      {"body" in page && page.body?.code && (
        <div>{page.body.code}</div>
      )}
    </main>
  );
}
