import Link from "next/link";

export default function PreviewExperience() {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-12">

      <p className="font-bold uppercase tracking-[0.4em] text-yellow-400">
        EXPERIENCE EDUNANCIAL
      </p>

      <h2 className="mt-6 text-5xl font-black">
        Start With a Preview
      </h2>

      <p className="mt-8 max-w-4xl text-xl text-slate-300">
        Experience one sample lesson, one Decision Lab,
        one AI coaching session, and a short competency assessment
        before choosing your membership.
      </p>

      <Link
        href="/preview"
        className="mt-10 inline-block rounded-xl bg-blue-600 px-8 py-5 text-xl font-bold"
      >
        Start Preview
      </Link>

    </section>
  );
}
