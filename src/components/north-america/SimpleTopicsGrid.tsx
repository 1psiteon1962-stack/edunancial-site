import { northAmericaSimpleTopics } from "@/data/north-america/simpleTopics";

export default function SimpleTopicsGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-4xl font-black text-white">Financial competency topics</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-5">
        {northAmericaSimpleTopics.map((topic) => (
          <div key={topic} className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm font-bold text-slate-200">
            {topic}
          </div>
        ))}
      </div>
    </section>
  );
}
