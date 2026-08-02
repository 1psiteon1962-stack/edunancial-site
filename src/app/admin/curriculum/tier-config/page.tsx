import type { Metadata } from "next";
import { cookies } from "next/headers";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import { readTierConfig } from "@/lib/curriculum/tier-config";
import TierConfigClient from "./TierConfigClient";

export const metadata: Metadata = {
  title: "Tier → Level Configuration | Curriculum | Edunancial Admin",
  robots: { index: false, follow: false },
};

export default async function TierConfigPage() {
  const session = await requireAdminPageSession();
  const config = readTierConfig();

  const tierOrder = ["basic", "pro", "gold"] as const;
  const rows = tierOrder.map((tier) => ({
    tier,
    label:
      tier === "basic" ? "Basic Membership" : tier === "pro" ? "Pro Membership" : "Gold Membership",
    levels: config.mapping[tier] ?? [],
  }));

  const cookieStore = await cookies();
  const csrfToken = cookieStore.get("edunancial_admin_csrf")?.value ?? "";

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <TierConfigClient
          initialRows={rows}
          freePreviewMaxLesson={config.freePreview.maxLesson}
          updatedAt={config.updatedAt}
          updatedBy={config.updatedBy}
          csrfToken={csrfToken}
        />
        <div className="mt-8 text-xs text-slate-600">
          Logged in as: {session.email}
        </div>
      </section>
    </main>
  );
}
