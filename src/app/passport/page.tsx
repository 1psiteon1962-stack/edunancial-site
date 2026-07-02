export const metadata = {
  title: "Competency Passport | Edunancial",
};

export default function PassportPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          COMPETENCY PASSPORT
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Your Learning Journey
        </h1>

        <p className="mt-10 text-2xl leading-10 text-slate-300">
          Complete courses.
          Pass assessments.
          Earn badges.
          Build financial competency.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          <div className="rounded-xl bg-red-700 p-8">
            RED
          </div>

          <div className="rounded-xl bg-white p-8 text-black">
            WHITE
          </div>

          <div className="rounded-xl bg-blue-700 p-8">
            BLUE
          </div>

          <div className="rounded-xl bg-green-700 p-8">
            MASTER
          </div>

        </div>

      </section>

    </main>

  );

}
