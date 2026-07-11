import { CompetencyAreaScore } from "@/lib/competency/types";
import { getLevelProgress } from "@/lib/competency/levels";

interface Props {
  overallScore: number;
  areaScores: CompetencyAreaScore[];
  completedCourses: number;
  totalCourses: number;
  completionPercentage: number;
}

export default function ProgressDashboard({
  overallScore,
  areaScores,
  completedCourses,
  totalCourses,
  completionPercentage,
}: Props) {
  const levelProgress = getLevelProgress(overallScore);

  return (
    <div className="space-y-8">

      <div className="rounded-2xl bg-slate-900 p-8">
        <h2 className="text-2xl font-bold">Overall Competency Progress</h2>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-slate-300">Score: {overallScore} / 100</span>
          <span className="text-slate-300">Level Progress: {levelProgress}%</span>
        </div>

        <div className="mt-3 h-4 w-full rounded-full bg-slate-700">
          <div
            className="h-4 rounded-full bg-blue-500 transition-all"
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 p-8">
        <h2 className="text-2xl font-bold">Competency Areas</h2>

        <div className="mt-6 space-y-5">
          {areaScores.map((area) => (
            <div key={area.areaId}>
              <div className="flex justify-between text-sm">
                <span>{area.label}</span>
                <span className="font-semibold">{area.score}</span>
              </div>
              <div className="mt-2 h-3 w-full rounded-full bg-slate-700">
                <div
                  className={`h-3 rounded-full transition-all ${area.color}`}
                  style={{ width: `${area.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 p-8">
        <h2 className="text-2xl font-bold">Course Completion</h2>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-slate-300">
            {completedCourses} of {totalCourses} courses completed
          </span>
          <span className="font-bold text-green-400">{completionPercentage}%</span>
        </div>

        <div className="mt-3 h-4 w-full rounded-full bg-slate-700">
          <div
            className="h-4 rounded-full bg-green-500 transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

    </div>
  );
}
