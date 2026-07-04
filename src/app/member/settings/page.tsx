export const metadata = {
  title: "Member Settings | Edunancial",
};

export default function MemberSettingsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">

      <div className="mb-12">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Account Settings
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Member Settings
        </h1>

        <p className="mt-6 max-w-3xl text-slate-300">
          Manage your account, profile, notifications,
          communication preferences, and membership settings.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-2">

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Personal Information
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Password & Security
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Communication Preferences
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
          Privacy Settings
        </div>

      </div>

    </main>
  );
}
