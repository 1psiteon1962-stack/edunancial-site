import Link from "next/link";

export const metadata = {
  title: "Our Story | Edunancial",
  description:
    "The story behind Edunancial and why financial competency matters.",
};

export default function WhyEdunancialPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.4em] font-bold text-yellow-400">
          OUR STORY
        </p>

        <h1 className="mt-6 text-6xl font-black">
          It Started With
          <br />
          One Eleven-Year-Old.
        </h1>

        <p className="mt-12 text-2xl leading-10 text-slate-300">
          Edunancial did not begin as a business.
          It began as a father trying to teach his son what most people
          are never taught about money, investing, entrepreneurship,
          and wealth creation.
        </p>

        <p className="mt-8 text-2xl leading-10 text-slate-300">
          Week after week...
          Month after month...
          Year after year...
          Those conversations evolved into lessons,
          exercises,
          discussions,
          and practical experience.
        </p>

      </section>

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-6xl px-6 py-24">

          <h2 className="text-5xl font-black">
            The Goal Was Never Memorization.
          </h2>

          <p className="mt-10 text-2xl leading-10 text-slate-300">
            Learning financial definitions is valuable.
            But definitions alone do not change lives.
          </p>

          <p className="mt-8 text-2xl leading-10 text-slate-300 font-semibold text-blue-400">
            Financial literacy provides the foundation.
            Financial competency is built through disciplined action.
          </p>

          <p className="mt-8 text-2xl leading-10 text-slate-300">
            Every lesson was followed by discussion.
            Every discussion became practice.
            Every practice became experience.
          </p>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">

        <h2 className="text-5xl font-black">
          Then Something Unexpected Happened.
        </h2>

        <p className="mt-10 text-2xl leading-10 text-slate-300">
          The same principles that worked inside one family began
          helping entrepreneurs in another country.
        </p>

        <p className="mt-8 text-2xl leading-10 text-slate-300">
          Different language.
          Different economy.
          Different culture.
        </p>

        <p className="mt-8 text-3xl font-bold text-white">
          The financial principles were exactly the same.
        </p>

      </section>

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-6xl px-6 py-24">

          <h2 className="text-5xl font-black">
            Our Mission
          </h2>

          <p className="mt-10 text-2xl leading-10 text-slate-300">
            We believe financial education should be practical,
            measurable,
            affordable,
            and available to anyone willing to learn.
          </p>

          <p className="mt-8 text-2xl leading-10 text-slate-300">
            Whether someone lives in Los Angeles,
            San Juan,
            Santo Domingo,
            Kampala,
            Nairobi,
            London,
            or Tokyo...
            the principles of building wealth remain remarkably similar.
          </p>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">

        <h2 className="text-5xl font-black">
          This Is Just The Beginning.
        </h2>

        <p className="mt-8 text-2xl leading-10 text-slate-300">
          Our hope is that Edunancial becomes the launch pad that helps
          people move from understanding financial concepts
          to developing real-world financial competency.
        </p>

        <Link
          href="/assessment"
          className="mt-12 inline-block rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
        >
          Start Your Journey
        </Link>

      </section>

    </main>
  );
}
