import { LEVEL_DEFINITIONS } from "@/lib/level-definitions";

interface LevelPageProps {
  params: {
    level: string;
  };
}

export default function LevelPage({ params }: LevelPageProps) {
  // Expecting routes like /levels/level1, /levels/level2, etc.
  const levelNum = Number(params.level.replace("level", ""));

  const level = LEVEL_DEFINITIONS.find(
    (definition) => definition.level === levelNum
  );

  if (!level) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Invalid level</h1>
        <p>The requested level does not exist.</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Level {level.level}: {level.title}
      </h1>

      <p className="mb-6 text-gray-700">{level.description}</p>

      <ul className="list-disc pl-6 space-y-2">
        {level.indicators.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </main>
  );
}
