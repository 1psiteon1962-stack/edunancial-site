// src/app/(regions)/(root)/page.tsx

import { getHomePage } from "@/lib/queries/homepage";

export default async function Page() {
  const page = await getHomePage();
  const clientModules = page?.clientModules ?? [];

  return (
    <main>
      <section>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </section>

      <section>
        {clientModules.map((module) => (
          <article key={module.id}>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
