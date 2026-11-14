import { requireAdminPageSession } from "@/lib/admin-content/auth";
import ReportsClient from "./ReportsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Weekly Reports | Edunancial Admin" };

export default async function ReportsPage() {
  await requireAdminPageSession();
  return <ReportsClient />;
}
