import React from "react";
import { getHomePage } from "@/lib/api/home";

function FallbackHome() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Edunancial</h1>
      <p>Site is loading. Content not available yet.</p>
    </main>
  );
}

export default async function Page() {
  try {
    const homePage = await getHomePage();

    /**
     * 🚨 HARD STOP — NO DATA = NO CRASH
     */
    if (
      !homePage ||
      typeof homePage !== "object" ||
      !homePage.data ||
      !homePage.data.attributes
    ) {
      console.error("Homepage data missing or invalid:", homePage);
      return <FallbackHome />;
    }

    const attributes = homePage.data.attributes;

    /**
     * 🚨 SAFE ACCESS — NEVER DESTRUCTURE DIRECTLY
     */
    const clientModules = Array.isArray(attributes.clientModules)
      ? attributes.clientModules
      : [];

    return (
      <main>
        <h1>Edunancial</h1>

        {clientModules.length === 0 ? (
          <p>No content modules yet.</p>
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
    console.error("Homepage fatal error:", error);
    return <FallbackHome />;
  }
}
