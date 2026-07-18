export const metadata = {
  title: "Events | Edunancial",
};

const events = [
  "Live Webinars",
  "Financial Workshops",
  "Business Bootcamps",
  "Executive Sessions",
  "Community Meetups",
  "Youth Programs",
  "Guest Speakers",
  "Global Events",
];

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          EVENTS
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Learn Together
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {events.map((event) => (

            <div
              key={event}
              className="rounded-xl bg-slate-900 p-8"
            >
              <h2 className="text-2xl font-black">
                {event}
              </h2>

              <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-bold">
                Learn More
              </button>

            </div>

          ))}

        </div>

      </section>
    </main>
  );
}
