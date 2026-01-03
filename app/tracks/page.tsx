import Link from "next/link";

const tracks = [
  {
    key: "foundation",
    title: "Foundation Track",
    desc: "Understand how money, income, debt, and systems actually work.",
    href: "/tracks/foundation",
  },
  {
    key: "business",
    title: "Business Track",
    desc: "Learn how business structure creates profit, protection, and scalability.",
    href: "/tracks/business",
  },
  {
    key: "investing",
    title: "Investing Track",
    desc: "Learn investing as a literacy skill — not hype, not gambling.",
    href: "/tracks/investing",
  },
  {
    key: "advanced",
    title: "Advanced Track",
    desc: "Systems-level thinking: control, scale, and long-term positioning.",
    href: "/tracks/advanced",
  },
];

export default function TracksIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Choose Your Track</h1>
        <p className="mt-3 text-lg text-gray-700">
          Start where you are. Each track gives you a clear path forward.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/start"
            className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Start Here →
          </Link>
          <Link
            href="/faq"
            className="rounded border border-gray-300 px-6 py-3 text-gray-900 hover:bg-gray-50"
          >
            FAQs
          </Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {tracks.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className="block rounded-lg border border-gray-200 p-6 hover:bg-gray-50"
          >
            <h2 className="text-2xl font-semibold">{t.title}</h2>
            <p className="mt-2 text-gray-700">{t.desc}</p>
            <p className="mt-4 font-medium text-black">Open track →</p>
          </Link>
        ))}
      </section>

      <footer className="mt-14 rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold">Not sure where to start?</h3>
        <p className="mt-2 text-gray-700">
          Start with Foundation. It’s built to remove confusion fast.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/tracks/foundation"
            className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Start Foundation →
          </Link>
          <Link
            href="/start"
            className="rounded border border-gray-300 px-6 py-3 text-gray-900 hover:bg-gray-50"
          >
            Get the track guide →
          </Link>
        </div>
      </footer>
    </main>
  );
}
