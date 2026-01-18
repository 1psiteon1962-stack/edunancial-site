import { LEVEL_DEFINITIONS } from "@/lib/level-definitions";

export default function LevelRouter({
  params
}: {
  params: { level: string };
}) {
  const levelNum = Number(params.level.replace("level-", ""));
  const level = LEVEL_DEFINITIONS.find(l => l.id === levelNum);

  if (!level) {
    return <div className="p-6">Invalid level</div>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{level.title}</h1>
      <p className="mt-4">{level.description}</p>
    </main>
  );
}
