export const metadata = {
  title: "Success Stories | Edunancial",
};

const stories = [
  "Students",
  "Families",
  "Entrepreneurs",
  "Veterans",
  "Professionals",
  "Small Business Owners",
  "Young Investors",
  "Community Leaders",
];

export default function SuccessStoriesPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          SUCCESS STORIES
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Real People.
          Real Progress.
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {stories.map((story) => (

            <div
              key={story}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >

              <h2 className="text-2xl font-black">
                {story}
              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>

  );

}
