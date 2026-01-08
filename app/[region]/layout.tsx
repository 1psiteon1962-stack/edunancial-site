// app/[region]/layout.tsx

import { ReactNode } from "react";
import { REGIONS, RegionCode } from "@/lib/regions.config";
import { notFound } from "next/navigation";

export default function RegionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { region: RegionCode };
}) {
  const region = REGIONS[params.region];

  if (!region || !region.enabled) {
    notFound();
  }

  return (
    <html lang={region.defaultLanguage}>
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen",
          background: "#ffffff",
          color: "#111111",
        }}
      >
        {children}
      </body>
    </html>
  );
}
