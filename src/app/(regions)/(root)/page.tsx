import React from "react";
import { getHomePage } from "@/lib/api/home";

/**
 * ✅ HARD FAILSAFE PAGE
 * This guarantees:
 * - Build NEVER crashes
 * - Works with or without CMS
 * - Works even if data = undefined
 */

export default async function HomePage() {
  let clientModules: any[] = [];

  try {
    const homePage = await getHomePage();

    /**
     * ✅ SAFE EXTRACTION (NO CRASH POSSIBLE)
     */
    clientModules =
      homePage?.data?.attributes?.clientModules ?? [];

  } catch (err) {
    console.error("Homepage load error:", err);
  }

  /**
   * ✅ FALLBACK UI (ALWAYS RENDERS)
   */
  if (!clientModules.length) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Edunancial</h1>
        <p>Platform is loading. Content will appear shortly.</p>
      </main>
    );
  }

  /**
   * ✅ NORMAL RENDER (SAFE)
   */
  return (
    <main>
      {clientModules.map((mod, idx) => (
        <div key={idx}>
          {/* Replace with your real module renderer */}
          <pre>{JSON.stringify(mod, null, 2)}</pre>
        </div>
      ))}
    </main>
  );
}
