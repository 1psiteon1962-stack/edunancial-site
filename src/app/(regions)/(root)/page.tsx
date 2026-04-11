import React from "react";
import { getHomePage } from "@/lib/api/home";

/**
 * 🚨 GUARANTEED SAFE FALLBACK
 */
function FallbackHome() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Edunancial</h1>
      <p>Site is loading. CMS data not available yet.</p>
    </main>
  );
}

export default async function Page() {
  try {
    const homePage = await getHomePage();

    /**
     * 🚨 HARD GUARD — NOTHING PASSES THIS WITHOUT VALID DATA
     */
    if (
      !homePage ||
      typeof homePage !== "object" ||
      !("data" in homePage) ||
      !homePage.data ||
      !homePage.data.attributes
    ) {
      console.error("Invalid homepage structure:", homePage);
      return <FallbackHome />;
    }

    const attributes = homePage.data.attributes;

    /**
     * 🚨 SAFE ACCESS — NO DIRECT DESTRUCTURING
     */
    const clientModules = Array.isArray(attributes.clientModules)
      ? attributes.clientModules
      : [];

    return (
      <main>
        <h1>Edunancial</h1>

        {clientModules.length === 0 ? (
          <p>No modules available.</p>
        ) : (
          clientModules.map((mod: any, idx: number) => (
            <div key={idx}>
              <pre>{JSON.stringify(mod, null, 2)}</pre>
            </div>
          ))
        )}
      </main>
    );
  } catch (error) {
    /**
     * 🚨 FINAL SAFETY NET — NOTHING CAN CRASH BUILD
     */
    console.error("Homepage fatal error:", error);
    return <FallbackHome />;
  }
}
