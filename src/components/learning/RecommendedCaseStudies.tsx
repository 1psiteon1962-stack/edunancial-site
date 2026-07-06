const studies = [

  "Uganda Restaurant",

  "Uganda Delivery Pivot",

  "Uganda Egg Farm ROI",

  "Security Company Growth",

  "Business Turnarounds",

  "Business Failures",

];

export default function RecommendedCaseStudies() {

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">

          Recommended Case Studies

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {studies.map((study)=>(

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

      </div>

    </section>

  );

}
