"use client";

import { ReactNode } from "react";
import { useUser } from "@/lib/auth/useUser";
import { canAccess } from "@/lib/accessControl";
import { AccessArea } from "@/data/access/accessMatrix";

export default function AccessGate({
  area,
  children
}: {
  area: AccessArea;
  children: ReactNode;
}) {
  const user = useUser();

  if (!user) {
    return <p className="text-center mt-12">Please log in</p>;
  }

  if (!canAccess(user.plan, area)) {
    return (
      <div className="border p-8 mt-12 text-center">
        <h2 className="text-2xl font-bold">Upgrade Required</h2>
        <p className="mt-2">This feature requires a higher plan.</p>
        <a href="/plans" className="inline-block mt-4 underline">
          View Plans
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
