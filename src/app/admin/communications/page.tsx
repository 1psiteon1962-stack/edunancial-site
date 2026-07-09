import AdminCommunicationsHub from "@/components/communications/AdminCommunicationsHub";

export const metadata = {
  title: "Communications Command Center | Edunancial",
  description:
    "Operate announcements, campaigns, reminders, newsletters, templates, and subscriber outreach.",
};

export default function AdminCommunicationsPage() {
  return <AdminCommunicationsHub mode="overview" />;
}
