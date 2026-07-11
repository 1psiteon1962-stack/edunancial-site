import MemberCommunicationsHub from "@/components/communications/MemberCommunicationsHub";

export const metadata = {
  title: "Messaging Center | Edunancial",
  description:
    "Review communication templates, outreach channels, and message operations.",
};

export default function MessagesPage() {
  return <MemberCommunicationsHub mode="messages" />;
}
