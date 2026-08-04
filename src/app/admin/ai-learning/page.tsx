import AILearningAdministrationPanel from "@/components/admin/AILearningAdministrationPanel";
import { requireAdminPageSession } from "@/lib/admin-content/auth";

export const metadata = { title: "AI Learning Network | Edunancial Admin" };

export default async function AILearningAdminPage() {
  await requireAdminPageSession();
  return <AILearningAdministrationPanel />;
}
