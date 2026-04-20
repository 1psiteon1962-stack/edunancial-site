// app/(regions)/(root)/page.tsx

import { getRootPageData } from "../../lib/content-resolver";

export default async function Page() {
  const page = await getRootPageData();

  return (
    <main>
      <h1>{page.title}</h1>

      {page.description && <p>{page.description}</p>}

      {page.body?.code && <div>{page.body.code}</div>}
    </main>
  );
}
