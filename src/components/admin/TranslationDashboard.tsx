export default function TranslationDashboard() {

  const languages = [
    "English",
    "Spanish",
    "French",
    "Portuguese",
    "Arabic",
    "Swahili",
  ];

  return (
    <section className="rounded-xl bg-slate-900 p-8">

      <h2 className="text-3xl font-black text-white">
        Translation Dashboard
      </h2>

      <div className="mt-8 space-y-3">

        {languages.map((language) => (

          <div
            key={language}
            className="flex justify-between rounded bg-slate-800 p-4"
          >
            <span className="text-white">
              {language}
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
