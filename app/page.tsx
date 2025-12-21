// app/page.tsx

"use client";

import { useEffect } from "react";

import { resolveRegion } from "@/lib/region-resolver";
import { getContent } from "@/lib/content-registry";
import type { Region } from "@/lib/regions";

export default function HomePage() {
  const region: Region = resolveRegion();
  const content = getContent(region);

  useEffect(() => {
    // placeholder for analytics
    console.log("Page view:", { page: "home", region });
  }, [region]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">
        {content.title}
      </h1>

      <p className="text-lg">
        {content.description}
      </p>
    </main>
  );
}
