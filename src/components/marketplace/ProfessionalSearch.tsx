export default function ProfessionalSearch() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-black">

          Search Professionals

        </h1>

        <div className="grid md:grid-cols-4 gap-4 mt-10">

          <input
            placeholder="Name"
            className="rounded-lg bg-slate-900 border border-slate-700 p-4"
          />

          <input
            placeholder="City"
            className="rounded-lg bg-slate-900 border border-slate-700 p-4"
          />

          <input
            placeholder="State"
            className="rounded-lg bg-slate-900 border border-slate-700 p-4"
          />

          <button className="rounded-lg bg-blue-600 p-4 font-bold">

            Search

          </button>

        </div>

        <div className="mt-12 rounded-xl bg-slate-900 border border-slate-700 p-8">

          Search results will appear here.

        </div>

      </section>

    </main>

  );

}
