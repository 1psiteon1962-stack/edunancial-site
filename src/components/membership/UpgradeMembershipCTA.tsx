import Link from "next/link";

export default function UpgradeMembershipCTA() {

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-5xl px-6 text-center">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          READY TO ADVANCE?

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Upgrade Your Membership

        </h2>

        <p className="mt-10 text-2xl leading-10 text-slate-300">

          Unlock additional courses,
          AI advisors,
          business tools,
          certifications,
          and advanced learning paths.

        </p>

        <div className="mt-16">

          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >

            View Membership Plans

          </Link>

        </div>

      </div>

    </section>

  );

}
