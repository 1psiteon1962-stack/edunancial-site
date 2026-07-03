export const metadata = {
  title: "Community | Edunancial",
};

export default function CommunityPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          COMMUNITY
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Learn Together.
          <br />
          Grow Together.
        </h1>

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          <div className="rounded-xl bg-slate-900 p-10">
            <h2 className="text-3xl font-black">Discussion Groups</h2>
          </div>

          <div className="rounded-xl bg-slate-900 p-10">
            <h2 className="text-3xl font-black">Study Groups</h2>
          </div>

          <div className="rounded-xl bg-slate-900 p-10">
            <h2 className="text-3xl font-black">Live Events</h2>
          </div>

        </div>

      </section>

    </main>

  );

}
