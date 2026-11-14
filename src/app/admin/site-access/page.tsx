import { requireAdminPageSession } from "@/lib/admin-content/auth";
import SiteAccessClient from "./SiteAccessClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website Access by Country | Edunancial Admin" };

export default async function SiteAccessPage() {
  await requireAdminPageSession();
  return <SiteAccessClient />;
}
