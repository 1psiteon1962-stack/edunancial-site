// app/(regions)/(root)/page.tsx

import { redirect } from "next/navigation";
import { regions } from "@/lib/regions";

/**
 * Root route (/)
 * Always redirects to a concrete region.
 */
export default function RootPage() {
  const DEFAULT_REGION = "global";

  const region = regions.find((r) => r.slug === DEFAULT_REGION);

  // Hard guard — should never fail, but prevents build/runtime crashes
  if (!region) {
    redirect("/global");
  }

  redirect(`/${region.slug}`);
}
