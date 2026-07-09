import MemberCommunicationsHub from "@/components/communications/MemberCommunicationsHub";

export const metadata = {
  title: "Notifications Center | Edunancial",
  description:
    "Track announcements, in-app notifications, reminders, and communication preferences.",
};

export default function NotificationsPage() {
  return <MemberCommunicationsHub mode="notifications" />;
}
