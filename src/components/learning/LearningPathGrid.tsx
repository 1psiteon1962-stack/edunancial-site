import LearningPathCard from "./LearningPathCard";
import { learningPaths } from "@/data/learningPaths";

export default function LearningPathGrid() {

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          LEARNING PATHS

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Your Learning Journey

        </h2>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">

          Every student follows a structured pathway from
          Financial Literacy to Financial Competency and ultimately
          Wealth Building.

        </p>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">

          {learningPaths.map((path) => (

            <LearningPathCard
              key={path.id}
              path={path}
            />

          ))}

        </div>

      </div>

    </section>

  );

}
