// app/(regions)/(root)/page.tsx

import { redirect } from "next/navigation";
import { regions } from "@/lib/regions";

/**
 * Root page (/)
 *
 * This route is rendered WITHOUT a `region` param.
 * We must explicitly choose a default region instead of
 * assuming params.region exists.
 */
export default function RootPage() {
  // Choose your canonical default region here
  const DEFAULT_REGION = "global";

  const region = regions.find((r) => r.slug === DEFAULT_REGION);

  // Absolute safety guard — should never fail, but prevents prerender crashes
  if (!region) {
    redirect("/global");
  }

  // Root should never try to render region content directly
  // Always redirect to a concrete region route
  redirect(`/${region.slug}`);
}
