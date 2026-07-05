import Link from "next/link";

export default function CaseStudyLibrary() {
  const studies = [
    "Uganda Restaurant",
    "Uganda Delivery Pivot",
    "Uganda Egg Farm ROI",
    "Security Company Growth",
    "Real Estate Investments",
    "Business Failures",
    "Business Turnarounds",
    "Coming Soon...",
  ];

  return (
    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          CASE STUDY LIBRARY
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Learn From Real Businesses
        </h2>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Every case study is based on real business situations,
          real numbers, real decisions and real outcomes.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {studies.map((study) => (

            <div
              key={study}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h3 className="text-2xl font-bold">
                {study}
              </h3>

            </div>

          ))}

        </div>

        <div className="mt-16">

          <Link
            href="/case-studies"
            className="rounded-xl bg-blue-600 px-10 py-5 font-bold"
          >
            Browse Case Studies
          </Link>

        </div>

      </div>

    </section>
  );
}
