import { notFound } from "next/navigation";
import { regions, defaultRegion } from "@/data/regions";

/*
Root landing page.

This MUST always resolve to a valid region object.
If the lookup fails, we fall back to defaultRegion so
Next.js prerender never receives undefined.
*/

export default function RootPage() {
  const region =
    regions?.find((r) => r.slug === "root") ??
    defaultRegion ??
    null;

  if (!region) {
    notFound();
  }

  const { clientModules = [] } = region;

  return (
    <main>
      {clientModules.map((Module: any, index: number) => (
        <Module key={index} />
      ))}
    </main>
  );
}
