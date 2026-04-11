import React from "react";
import { getRegion } from "@/lib/regions";
import { defaultRegionSlug } from "@/lib/site-config";

function FallbackHome({
  message = "Site is loading. Content will appear soon.",
}: {
  message?: string;
}) {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Edunancial</h1>
      <p>{message}</p>
    </main>
  );
}

export default async function Page() {
  try {
    const region = getRegion(defaultRegionSlug);

    if (!region) {
      return (
        <FallbackHome
          message={`Default region "${defaultRegionSlug}" was not found.`}
        />
      );
    }

    const clientModules = Array.isArray((region as any).clientModules)
      ? (region as any).clientModules
      : [];

    return (
      <main style={{ padding: "40px" }}>
        <h1>Edunancial</h1>

        {clientModules.length === 0 ? (
          <p>No modules are configured for this region yet.</p>
        ) : (
          clientModules.map((mod: any, index: number) => (
            <section key={index} style={{ marginBottom: "24px" }}>
              <pre>{JSON.stringify(mod, null, 2)}</pre>
            </section>
          ))
        )}
      </main>
    );
  } catch (error) {
    console.error("Home page render failed:", error);
    return <FallbackHome message="Unexpected error loading home page." />;
  }
}
