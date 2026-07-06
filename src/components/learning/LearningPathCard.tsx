import Link from "next/link";
import { LearningPath } from "@/data/learningPaths";

interface Props {
  path: LearningPath;
  progress?: number;
}

export default function LearningPathCard({
  path,
  progress = 0,
}: Props) {

  const colorMap = {
    red: "bg-red-700",
    white: "bg-white text-slate-900",
    blue: "bg-blue-700",
    gold: "bg-yellow-500 text-slate-900",
  };

  return (

    <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-lg">

      <div className={`p-5 font-black text-xl ${colorMap[path.color]}`}>

        {path.title}

      </div>

      <div className="p-8">

        <p className="text-lg font-semibold text-yellow-400">

          {path.subtitle}

        </p>

        <p className="mt-4 text-slate-300">

          {path.description}

        </p>

        <div className="mt-8 space-y-2 text-sm text-slate-400">

          <div>

            Difficulty: <strong>{path.difficulty}</strong>

          </div>

          <div>

            Estimated Time: <strong>{path.estimatedHours} Hours</strong>

          </div>

          <div>

            Certificate: <strong>{path.competencyAward}</strong>

          </div>

        </div>

        <div className="mt-8">

          <div className="mb-2 flex justify-between">

            <span>Progress</span>

            <span>{progress}%</span>

          </div>

          <div className="h-3 rounded-full bg-slate-700">

            <div
              className="h-3 rounded-full bg-green-500"
              style={{ width: `${progress}%` }}
            />

          </div>

        </div>

        <Link
          href={`/learning-paths/${path.id}`}
          className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700"
        >

          Continue Learning

        </Link>

      </div>

    </div>

  );

}
