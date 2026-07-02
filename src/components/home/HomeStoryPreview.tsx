import Link from "next/link";

export default function HomeStoryPreview() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.4em] text-yellow-400">
          OUR STORY
        </p>

        <h2 className="mt-6 text-6xl font-black text-white">
          Why Edunancial Exists
        </h2>

        <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
          Edunancial wasn't created in a boardroom.
          It began with a conversation between a father and his
          eleven-year-old son about building a better future.
        </p>

        <Link
          href="/why-edunancial"
          className="mt-12 inline-block rounded-xl bg-blue-600 px-8 py-5 text-xl font-bold hover:bg-blue-700"
        >
          Read Our Story
        </Link>

      </div>

    </section>
  );
}
