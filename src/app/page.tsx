// src/app/page.tsx

import { loadPricing } from "@/lib/pricing/loadPricing";

export default async function HomePage() {
  const pricing = await loadPricing();

  return (
    <main>
      <h1>Edunancial</h1>
      <pre>{JSON.stringify(pricing, null, 2)}</pre>
    </main>
  );
}
