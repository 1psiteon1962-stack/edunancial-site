// app/layout.tsx

import type { ReactNode } from "react";
import RegionNav from "@/components/RegionNav";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RegionNav />
        {children}
      </body>
    </html>
  );
}
