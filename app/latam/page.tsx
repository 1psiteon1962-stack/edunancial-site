// app/latam/page.tsx

import { resolveCopy } from "@/lib/core";

export default function LatamIndexPage() {
  const copy = resolveCopy("LATAM", "es");

  return <main>{copy}</main>;
}
