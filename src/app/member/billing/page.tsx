export const metadata = {
  title: "Billing | Edunancial",
};

export default function BillingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">

      <div className="mb-12">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Membership Billing
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Billing Center
        </h1>

      </div>

      <div className="grid gap-8">

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Current Membership Plan
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Payment Method
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Billing History
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Upcoming Renewal
        </div>

      </div>

    </main>
  );
}
