"use client";

import { ReactNode } from "react";
import { useUser } from "@/lib/auth/useUser";
import { canAccess } from "@/lib/access/canAccess";

type Props = {
  area: string;
  children: ReactNode;
};

export default function AccessGate({ area, children }: Props) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="border p-8 mt-12 text-center">
        <p className="opacity-70">Checking access…</p>
      </div>
    );
  }

  if (!user || !canAccess(user.plan, area)) {
    return (
      <div className="border p-8 mt-12 text-center">
        <h2 className="text-2xl font-bold">Upgrade Required</h2>
        <p className="mt-4 text-gray-600">
          This section requires a higher plan.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
