// components/sections/StorySection.tsx
export default function StorySection() {
  return (
    <section className="bg-white py-16" id="story">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            Our Story
          </h2>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            It started with a question from my son.
          </h3>
        </div>

        <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
          <p>
            When my son was still young, he saw an online payment come in and
            asked me a simple question:{" "}
            <span className="font-semibold italic">
              &quot;How do I work with my head, not just my back?&quot;
            </span>{" "}
            That moment became the seed of Edunancial.
          </p>
          <p>
            I started teaching him the way I teach adults: discipline first,
            then habits, then wealth. One ounce of silver at a time. Then gold.
            Then understanding how businesses, stocks, and real estate really
            work.
          </p>
          <p>
            Edunancial exists to give that same advantage to other youth, young
            adults, and entrepreneurs — especially those who never grew up with
            access to this information.
          </p>
          <p>
            Our goal is simple: make financial education clear, practical, and
            available in more than one language, so the next generation can
            build, own, and scale with confidence.
          </p>
        </div>
      </div>
    </section>
  );
}
