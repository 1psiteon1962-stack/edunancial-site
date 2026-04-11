import React from "react";
import { fetchHomepageData } from "@/lib/cms/fetchHomepageData";

function FallbackHome() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>Edunancial</h1>
      <p>Content is loading. Please check back shortly.</p>
    </main>
  );
}

export default async function HomePage() {
  const homepage = await fetchHomepageData();

  // ✅ GUARANTEED SAFE
  if (!homepage || !homepage.clientModules) {
    return <FallbackHome />;
  }

  return (
    <main>
      {homepage.clientModules.length === 0 ? (
        <FallbackHome />
      ) : (
        homepage.clientModules.map((mod: any, index: number) => (
          <section key={index}>
            <pre>{JSON.stringify(mod, null, 2)}</pre>
          </section>
        ))
      )}
    </main>
  );
}
