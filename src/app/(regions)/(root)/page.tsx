import React from "react";
import { getHomePage } from "@/lib/api/home";

export default async function HomePage() {
  let clientModules: any[] = [];

  try {
    const homePage = await getHomePage();

    clientModules =
      homePage?.data?.attributes?.clientModules ?? [];
  } catch (err) {
    console.error("Homepage crash prevented:", err);
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Edunancial</h1>

      {clientModules.length === 0 ? (
        <p>Content loading...</p>
      ) : (
        clientModules.map((mod, i) => (
          <pre key={i}>{JSON.stringify(mod, null, 2)}</pre>
        ))
      )}
    </main>
  );
}
