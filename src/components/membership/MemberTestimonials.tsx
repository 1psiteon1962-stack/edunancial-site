export default function MemberTestimonials() {
  const testimonials = [
    {
      name: "Future Entrepreneur",
      quote:
        "I finally understand how business, investing and personal finance work together.",
    },
    {
      name: "Future Investor",
      quote:
        "The Financial Competency Assessment showed me exactly where I needed to improve.",
    },
    {
      name: "Future Business Owner",
      quote:
        "This is more than courses. It is a complete system for lifelong learning.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Testimonials
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Designed To Produce Results
        </h2>

      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">

        {testimonials.map((item) => (

          <div
            key={item.name}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8"
          >

            <p className="italic text-slate-300">
              "{item.quote}"
            </p>

            <p className="mt-8 font-semibold">
              {item.name}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}
