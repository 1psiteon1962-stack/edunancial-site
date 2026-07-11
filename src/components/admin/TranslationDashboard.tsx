import { supportedLanguages } from "@/lib/i18n/languages";

export default function TranslationDashboard() {
  return (
    <section className="rounded-xl bg-slate-900 p-8">

      <h2 className="text-3xl font-black text-white">
        Translation Dashboard
      </h2>

      <div className="mt-8 space-y-3">

        {supportedLanguages.map((language) => (

          <div
            key={language.code}
            className="flex justify-between rounded bg-slate-800 p-4"
          >
            <span className="text-white">
              {language.label}
            </span>

            <span className="text-green-400">
              Active
            </span>

          </div>

        ))}

      </div>

    </section>
  );
}
