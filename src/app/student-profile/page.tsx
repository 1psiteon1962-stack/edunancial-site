export const metadata = {
  title: "Student Profile | Edunancial",
};

export default function StudentProfilePage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          STUDENT PROFILE
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Your Progress
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          <div className="rounded-xl bg-slate-900 p-10">

            <h2 className="text-3xl font-black">
              Competency Score
            </h2>

            <p className="mt-6 text-6xl font-black text-green-400">
              87%
            </p>

          </div>

          <div className="rounded-xl bg-slate-900 p-10">

            <h2 className="text-3xl font-black">
              Current Rank
            </h2>

            <p className="mt-6 text-6xl font-black text-yellow-400">
              Gold
            </p>

          </div>

        </div>

      </section>

    </main>

  );

}
