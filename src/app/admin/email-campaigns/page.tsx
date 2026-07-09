import AdminCommunicationsHub from "@/components/communications/AdminCommunicationsHub";

export const metadata = {
  title: "Email Campaign Operations | Edunancial",
};

export default function EmailCampaignsPage() {
  return <AdminCommunicationsHub mode="campaigns" />;
}
