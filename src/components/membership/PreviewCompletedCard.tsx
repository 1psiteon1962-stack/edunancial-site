import Link from "next/link";

export default function PreviewCompletedCard() {
  return (
    <section className="rounded-3xl bg-green-900 p-12">

      <h2 className="text-5xl font-black">

        Preview Complete

      </h2>

      <p className="mt-8 text-xl">

        You've experienced how Edunancial works.

        Your complete Financial Competency journey
        begins with membership.

      </p>

      <Link
        href="/membership"
        className="mt-10 inline-block rounded-xl bg-white px-8 py-5 font-bold text-slate-900"
      >
        View Membership Options
      </Link>

    </section>
  );
}
