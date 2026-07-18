export const metadata = {
  title: "Video Library | Edunancial",
};

const videos = [
  "Financial Competency",
  "RED Courses",
  "WHITE Courses",
  "BLUE Courses",
  "Business Strategy",
  "Economic Self Defense",
  "Investing Basics",
  "Family Learning",
];

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          VIDEO LIBRARY
        </p>

        <h1 className="mt-6 text-6xl font-black">

          Watch.
          Learn.
          Apply.

        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {videos.map((video) => (

            <div
              key={video}
              className="rounded-xl bg-slate-900 p-10"
            >

              <div className="aspect-video rounded-lg bg-slate-800 flex items-center justify-center">

                ▶

              </div>

              <h2 className="mt-8 text-3xl font-black">

                {video}

              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}
