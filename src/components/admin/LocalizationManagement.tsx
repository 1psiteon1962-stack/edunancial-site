export default function LocalizationManagement() {
  return (
    <section className="rounded-xl bg-slate-900 p-8">

      <h2 className="text-3xl font-black text-white">

        Localization Manager

      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <div className="rounded-lg bg-slate-800 p-6">
          <h3 className="font-bold text-white">
            Languages
          </h3>

          <p className="mt-2 text-slate-400">
            English, Spanish, French, Portuguese,
            Swahili, Arabic.
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-6">

          <h3 className="font-bold text-white">
            Currency
          </h3>

          <p className="mt-2 text-slate-400">
            Automatic regional currency detection.
          </p>

        </div>

        <div className="rounded-lg bg-slate-800 p-6">

          <h3 className="font-bold text-white">
            Consumer Behavior
          </h3>

          <p className="mt-2 text-slate-400">
            Mobile-first pricing and content localization.
          </p>

        </div>

      </div>

    </section>
  );
}
