import BetaCodesAdminPanel from "@/components/admin/BetaCodesAdminPanel";
import BetaTestersAdminClient from "@/components/admin/BetaTestersAdminClient";

export const metadata = {
  title: "Beta Tester Management | Edunancial Admin",
};

export default function BetaTestersAdminPage() {
  return (
    <>
      <BetaCodesAdminPanel />
      <BetaTestersAdminClient />
    </>
  );
}
