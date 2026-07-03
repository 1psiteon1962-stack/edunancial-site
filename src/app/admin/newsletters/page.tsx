export const metadata = {
  title: "Edunancial News",
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          NEWSROOM
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Latest News & Announcements
        </h1>

        <div className="mt-20 space-y-8">

          <div className="rounded-xl bg-slate-900 p-10">
            <h2 className="text-3xl font-black">
              Latest Announcements
            </h2>
          </div>

          <div className="rounded-xl bg-slate-900 p-10">
            <h2 className="text-3xl font-black">
              Press Releases
            </h2>
          </div>

          <div className="rounded-xl bg-slate-900 p-10">
            <h2 className="text-3xl font-black">
              New Courses
            </h2>
          </div>

        </div>

      </section>

    </main>
  );
}
