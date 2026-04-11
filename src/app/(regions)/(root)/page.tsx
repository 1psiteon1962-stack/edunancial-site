import React from "react";

// 👉 adjust import if your path differs
import { fetchHomepageData } from "@/lib/cms/fetchHomepageData";

/**
 * ✅ SAFE FALLBACK COMPONENT
 */
function FallbackHome() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>Edunancial</h1>
      <p>Content is loading. Please check back shortly.</p>
    </main>
  );
}

export default async function HomePage() {
  let homepage: any = null;

  try {
    homepage = await fetchHomepageData();
  } catch (err) {
    console.error("Homepage fetch failed:", err);
  }

  /**
   * ✅ CRITICAL FIX
   * Prevents:
   * Cannot read properties of undefined (reading 'clientModules')
   */
  if (!homepage || !homepage.clientModules) {
    return <FallbackHome />;
  }

  const { clientModules } = homepage;

  return (
    <main>
      {clientModules.map((mod: any, index: number) => {
        // Basic safe rendering — adjust based on your module system
        return (
          <section key={index}>
            <pre>{JSON.stringify(mod, null, 2)}</pre>
          </section>
        );
      })}
    </main>
  );
}
