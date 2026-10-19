import BetaCodesAdminPanel from "@/components/admin/BetaCodesAdminPanel";
import BetaFeedbackList from "@/components/admin/BetaFeedbackList";
import { requireOwnerPageSession } from "@/lib/admin-content/auth";

export const metadata = {
  title: "Beta Tester Management | Edunancial Admin",
};

export const dynamic = "force-dynamic";

export default async function BetaTestersAdminPage() {
  await requireOwnerPageSession();
  return (
    <>
      <BetaCodesAdminPanel />
      <BetaFeedbackList />
    </>
  );
}
