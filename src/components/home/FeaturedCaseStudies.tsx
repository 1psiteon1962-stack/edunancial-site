import Link from "next/link";

export default function FeaturedCaseStudies() {

  const cases = [

    "Uganda Restaurant",

    "Uganda Delivery Pivot",

    "Uganda Egg Farm",

    "Security Company Growth",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          FEATURED CASE STUDIES

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Learn From Real Businesses

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {cases.map((item)=>(

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8"
            >

              {item}

            </div>

          ))}

        </div>

        <div className="mt-12">

          <Link
            href="/case-studies"
            className="rounded-xl bg-blue-600 px-8 py-4 font-bold"
          >

            View All Case Studies

          </Link>

        </div>

      </div>

    </section>

  );

}
