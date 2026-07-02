export const metadata = {
  title: "Course Catalog | Edunancial",
};

const categories = [
  "RED - Real Estate",
  "WHITE - Investing",
  "BLUE - Business",
  "Financial Foundations",
  "Economic Self Defense",
  "Family Learning",
  "Teen Entrepreneurs",
  "Executive Learning",
];

export default function CourseCatalogPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          COURSE CATALOG
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Explore Every Course
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {categories.map((course) => (

            <div
              key={course}
              className="rounded-xl bg-slate-900 p-8 hover:bg-slate-800 cursor-pointer"
            >

              <h2 className="text-2xl font-black">

                {course}

              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>

  );

}
