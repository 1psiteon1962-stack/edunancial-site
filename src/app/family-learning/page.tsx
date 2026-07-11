import FamilyLearningPlatform from "@/components/family/FamilyLearningPlatform";

export const metadata = {
  title: "Family Learning | Edunancial",
};

export default function FamilyLearningPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <FamilyLearningPlatform
          eyebrow="Family learning"
          title="Build wealth habits together with one connected family platform"
          description="Create parent and child accounts, track household goals, share progress, and unlock age-appropriate financial learning for every member of the family."
        />
      </section>
    </main>
  );
}
