import Link from "next/link";

export default function UpgradeMembership() {

  return (

    <section className="mx-auto max-w-6xl px-6 py-20">

      <div className="rounded-2xl border border-yellow-600 bg-slate-900/60 p-10">

        <h2 className="text-4xl font-bold">
          Upgrade Anytime
        </h2>

        <p className="mt-8 leading-8 text-slate-300">
          As your financial competency grows, you can upgrade your membership
          to unlock additional educational resources, AI capabilities,
          marketplace benefits, and business tools.
        </p>

        <div className="mt-10">

          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white"
          >
            Compare Plans
          </Link>

        </div>

      </div>

    </section>

  );

}
