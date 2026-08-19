import { requireAdminPageSession } from "@/lib/admin-content/auth";
import CountryLaunchControlsClient from "./CountryLaunchControlsClient";

export const dynamic = "force-dynamic";

export default async function AdminRegionsPage() {
  await requireAdminPageSession();
  return <CountryLaunchControlsClient />;
}
