// components/RegionCurriculum.tsx

import { getUSCurriculum } from "@/data/curriculum/us";
import { US_REGION } from "@/data/regions/us";

export default function RegionCurriculum({
  regionKey,
  lang,
}: {
  regionKey: string;
  lang: string;
}) {
  if (regionKey !== "us") return null;

  const curriculum = getUSCurriculum(lang);
  const pricing = US_REGION.pricing;

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{curriculum.title}</h1>

      {curriculum.levels.map((level) => (
        <div
          key={level.level}
          className="border rounded-lg p-4 mb-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">
            Level {level.level}: {level.title}
          </h2>

          <p className="mt-2 text-gray-700">{level.description}</p>

          <ul className="list-disc ml-6 mt-3">
            {level.modules.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>

          <div className="mt-4 font-bold">
            {pricing[`level${level.level}` as keyof typeof pricing].label[
              lang as "en" | "es"
            ]}
          </div>

          <button className="mt-3 px-4 py-2 bg-black text-white rounded">
            Continue
          </button>
        </div>
      ))}
    </section>
  );
}
