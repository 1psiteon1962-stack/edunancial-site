import Link from "next/link";

export const metadata = {
  title: "Courses | Edunancial",
};

const tracks = [
  {
    color: "RED",
    title: "Real Estate Competency",
    description:
      "Residential • Commercial • Tax Liens • Tax Deeds • 1031 Exchanges • Creative Financing",
    href: "/courses/red",
    bg: "bg-red-700",
  },
  {
    color: "WHITE",
    title: "Financial Asset Competency",
    description:
      "Budgeting • Credit • Stocks • ETFs • Options • Precious Metals • Retirement",
    href: "/courses/white",
    bg: "bg-white text-black",
  },
  {
    color: "BLUE",
    title: "Business Competency",
    description:
      "Entrepreneurship • Marketing • KPIs • Profit • Leadership • Scaling",
    href: "/courses/blue",
    bg: "bg-blue-700",
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.4em] text-yellow-400 font-bold">
          COURSE LIBRARY
        </p>

        <h1 className="mt-8 text-7xl font-black">
          Build Financial Competency
        </h1>

        <p className="mt-10 max-w-5xl text-2xl text-slate-300 leading-10">
          Financial literacy provides the foundation.
          Financial competency is built through disciplined action.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          {tracks.map((track) => (

            <Link
              key={track.color}
              href={track.href}
              className={`${track.bg} rounded-xl p-10`}
            >

              <h2 className="text-5xl font-black">
                {track.color}
              </h2>

              <h3 className="mt-8 text-2xl font-bold">
                {track.title}
              </h3>

              <p className="mt-6 text-lg">
                {track.description}
              </p>

            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}
