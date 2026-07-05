export default function SuccessStories() {
  const stories = [
    {
      title: "Students",
      text: "Build financial competency through structured education and measurable progress."
    },
    {
      title: "Families",
      text: "Create a culture where financial education becomes a lifelong family tradition."
    },
    {
      title: "Entrepreneurs",
      text: "Use financial knowledge, KPIs and profit-focused decision making to build stronger businesses."
    },
    {
      title: "Investors",
      text: "Make informed investment decisions based on education instead of emotion."
    }
  ];

  return (
    <section className="bg-[#111827] py-24">
      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          SUCCESS STORIES
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Built For Real Life
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {stories.map((story) => (
            <div
              key={story.title}
              className="rounded-2xl bg-slate-900 p-10"
            >
              <h3 className="text-3xl font-black">
                {story.title}
              </h3>

              <p className="mt-6 text-xl leading-9 text-slate-300">
                {story.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
