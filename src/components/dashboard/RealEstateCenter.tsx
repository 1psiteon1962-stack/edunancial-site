import Link from "next/link";

const topics = [
  "Residential",
  "Commercial",
  "Tax Liens",
  "Tax Deeds",
  "Creative Financing",
  "1031 Exchanges",
  "Property Management",
  "Due Diligence",
];

export default function RealEstateCenter() {
  return (
    <section className="rounded-2xl bg-red-950 p-10">

      <h2 className="text-4xl font-black">
        Real Estate Center
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {topics.map((topic) => (
          <Link
            key={topic}
            href="/real-estate"
            className="rounded-xl bg-slate-900 p-5 hover:bg-slate-800"
          >
            {topic}
          </Link>
        ))}
      </div>

    </section>
  );
}
