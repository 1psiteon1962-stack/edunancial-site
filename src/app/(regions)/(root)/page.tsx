import React from "react";
import { getHomePage } from "@/lib/api/home";

/**
 * ✅ SAFE FALLBACK UI
 */
function FallbackHome() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Edunancial</h1>
      <p>Content is loading. Please check back shortly.</p>
    </main>
  );
}

export default async function Page() {
  let homePage: any = null;

  try {
    homePage = await getHomePage();
  } catch (error) {
    console.error("Homepage fetch failed:", error);
    return <FallbackHome />;
  }

  /**
   * 🚨 CRITICAL FIX
   * Prevent crash when data is undefined
   */
  if (!homePage || !homePage.data || !homePage.data.attributes) {
    console.error("Homepage data missing or malformed");
    return <FallbackHome />;
  }

  const attributes = homePage.data.attributes;

  /**
   * ✅ SAFE DESTRUCTURE
   */
  const clientModules = attributes.clientModules ?? [];

  return (
    <main>
      <h1>Edunancial</h1>

      {/* Example safe rendering */}
      {clientModules.length === 0 ? (
        <p>No modules available yet.</p>
      ) : (
        clientModules.map((mod: any, idx: number) => (
          <div key={idx}>
            <pre>{JSON.stringify(mod, null, 2)}</pre>
          </div>
        ))
      )}
    </main>
  );
}
