"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackKPI } from "@/lib/kpi/client";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams?.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;

    trackKPI("page_view", {
      path: pathname,
      metadata: { url },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
