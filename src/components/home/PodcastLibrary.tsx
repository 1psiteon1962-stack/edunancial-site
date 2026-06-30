export default function PodcastLibrary() {

  const episodes = [
    "Financial Foundations",
    "Building Wealth",
    "Starting a Business",
    "Real Estate Investing",
    "Understanding Stocks",
    "Economic Self Defense"
  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">
          Podcast Library
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          {episodes.map((episode) => (

            <div
              key={episode}
              className="rounded-2xl bg-[#111827] p-8"
            >

              <h3 className="text-2xl font-bold">
                {episode}
              </h3>

              <p className="mt-4 text-gray-400">
                Coming Soon
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>

  );
}
