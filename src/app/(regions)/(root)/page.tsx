import React from "react";
import { getHomePage } from "@/lib/api/home";

/**
 * ✅ SAFE FALLBACK UI
 */
function FallbackHome() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>Edunancial</h1>
      <p>Content temporarily unavailable.</p>
    </main>
  );
}

export default async function HomePage() {
  let homePage: any = null;

  try {
    homePage = await getHomePage();
  } catch (err) {
    console.error("Strapi fetch failed:", err);
  }

  /**
   * ✅ CRITICAL FIX
   * Prevents:
   * Cannot read properties of undefined (reading 'clientModules')
   */
  if (!homePage || !homePage.data || !homePage.data.attributes) {
    return <FallbackHome />;
  }

  const attributes = homePage.data.attributes;

  const clientModules = attributes.clientModules || [];

  /**
   * ✅ FINAL SAFE RENDER
   */
  if (!clientModules || clientModules.length === 0) {
    return <FallbackHome />;
  }

  return (
    <main>
      {clientModules.map((mod: any, index: number) => (
        <section key={index}>
          <pre>{JSON.stringify(mod, null, 2)}</pre>
        </section>
      ))}
    </main>
  );
}
