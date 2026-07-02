export const metadata = {
  title: "Edunancial Passport",
};

export default function PassportPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h1 className="text-7xl font-black">

          Your Edunancial Passport

        </h1>

        <p className="mt-10 max-w-5xl text-2xl text-slate-300">

          Every lesson.

          Every mission.

          Every challenge.

          Every simulation.

          Every certificate.

          Builds your Financial Competency.

        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          <div className="rounded-xl bg-slate-900 p-8">

            <h2 className="text-2xl font-black">

              XP Earned

            </h2>

            <p className="mt-6 text-5xl font-black text-blue-500">

              7,850

            </p>

          </div>

          <div className="rounded-xl bg-slate-900 p-8">

            <h2 className="text-2xl font-black">

              Current Level

            </h2>

            <p className="mt-6 text-4xl font-black">

              Entrepreneur

            </p>

          </div>

          <div className="rounded-xl bg-slate-900 p-8">

            <h2 className="text-2xl font-black">

              Competency

            </h2>

            <p className="mt-6 text-5xl font-black text-green-400">

              82%

            </p>

          </div>

        </div>

      </section>

    </main>
  );
}
