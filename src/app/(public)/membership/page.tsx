import { EDUNANCIAL_LONG_DESCRIPTION } from "@/lib/positioning";

import MembershipPageClient from "./MembershipPageClient";

export const metadata = {
  title: "Edunancial Membership | Financial Literacy Membership Platform",
  description: EDUNANCIAL_LONG_DESCRIPTION,
};

export default function MembershipPage() {
  return <MembershipPageClient />;
}
