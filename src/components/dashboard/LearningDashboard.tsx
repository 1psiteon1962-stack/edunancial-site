import LearningPathGrid from "@/components/learning/LearningPathGrid";
import CompetencyProgress from "@/components/learning/CompetencyProgress";
import NextLessonCard from "@/components/learning/NextLessonCard";

export default function LearningDashboard() {

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-6xl font-black">

          Learning Dashboard

        </h1>

        <div className="mt-16">

          <NextLessonCard />

        </div>

        <div className="mt-24">

          <CompetencyProgress />

        </div>

        <div className="mt-24">

          <LearningPathGrid />

        </div>

      </div>

    </section>

  );

}
