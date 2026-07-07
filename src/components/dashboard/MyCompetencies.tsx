const competencies = [
  ["Financial Literacy", 0],
  ["Financial Competency", 0],
  ["Business", 0],
  ["Investing", 0],
  ["Real Estate", 0],
  ["Artificial Intelligence", 0],
];

export default function MyCompetencies() {
  return (
    <section className="rounded-2xl bg-slate-900 p-10">
      <h2 className="text-3xl font-black">
        My Competencies
      </h2>

      <div className="mt-8 space-y-6">
        {competencies.map(([name, score]) => (
          <div key={name}>
            <div className="mb-2 flex justify-between">
              <span>{name}</span>
              <span>{score}%</span>
            </div>

            <div className="h-3 rounded-full bg-slate-700">
              <div
                className="h-3 rounded-full bg-green-500"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
