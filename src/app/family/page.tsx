import FamilyLearningPlatform from "@/components/family/FamilyLearningPlatform";

export const metadata = {
  title: "Family | Edunancial",
  description:
    "Guide parents and children through shared financial goals, progress tracking, and family learning milestones.",
};

export default function FamilyLearningPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <FamilyLearningPlatform
          eyebrow="Family platform"
          title="Give every family member a clear path to financial confidence"
          description="Parents can set permissions, children can follow age-appropriate lessons, and the full household can celebrate shared wins from a single responsive dashboard."
        />
      </section>
    </main>
  );
}
