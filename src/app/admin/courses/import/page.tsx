import { requireAdminPageSession } from "@/lib/admin-content/auth";
import ClaudeImportClient from "@/components/admin-content/ClaudeImportClient";

export const metadata = { title: "Import Course | Edunancial Admin" };

export default async function CourseImportPage() {
  await requireAdminPageSession();
  return <ClaudeImportClient />;
}
