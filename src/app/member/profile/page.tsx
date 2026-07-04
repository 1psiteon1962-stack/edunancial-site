export const metadata = {
  title: "My Profile | Edunancial",
};

export default function MemberProfilePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">

      <h1 className="text-4xl font-bold">
        My Member Profile
      </h1>

      <div className="mt-12 grid gap-8 md:grid-cols-2">

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Personal Information
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Membership Information
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Learning Progress
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Billing Summary
        </div>

      </div>

    </main>
  );
}
