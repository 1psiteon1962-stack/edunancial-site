import Link from "next/link";

export const metadata = {
  title: "Subscription Management | Edunancial",
};

export default function SubscriptionPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="text-4xl font-bold">
        Manage Your Membership
      </h1>

      <div className="mt-12 grid gap-8">

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Current Membership
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Upgrade Membership
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Downgrade Membership
        </div>

        <div className="rounded-xl border border-red-700 bg-red-950/20 p-8">
          Cancel Membership
        </div>

      </div>

      <div className="mt-10">

        <Link
          href="/membership"
          className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white"
        >
          Compare Membership Plans
        </Link>

      </div>

    </main>
  );
}
