import { supportedLanguages } from "@/lib/i18n";

const languageNames: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  pt: "Portuguese",
  ar: "Arabic",
  ja: "Japanese",
  ko: "Korean",
  de: "German",
  it: "Italian",
};

const languageRegions: Record<string, string> = {
  en: "Global",
  es: "Latin America, Caribbean",
  fr: "Caribbean, Africa, Europe",
  pt: "Latin America, Africa",
  ar: "Middle East, Africa",
  ja: "Asia Pacific",
  ko: "Asia Pacific",
  de: "Europe",
  it: "Europe",
};

export default function LanguagesAdminPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Global
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Language Administration
        </h1>
        <p className="mt-3 text-gray-400">
          Manage platform translations and localization settings.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Languages Supported", value: supportedLanguages.length },
          { label: "Translations Active", value: supportedLanguages.length },
          { label: "Pending Translations", value: "0" },
          { label: "Regions Covered", value: "8" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-4xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="font-bold">Supported Languages</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                {["Language", "Code", "Regions", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold tracking-wider text-gray-400 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {supportedLanguages.map((lang) => (
                <tr key={lang} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-semibold">{languageNames[lang] ?? lang}</td>
                  <td className="px-6 py-4 font-mono text-gray-400">{lang}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{languageRegions[lang] ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-500/10 text-green-400 px-2.5 py-1 text-xs font-bold">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-400 hover:text-blue-300 text-xs font-semibold">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
