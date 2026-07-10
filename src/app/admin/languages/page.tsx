import { supportedLanguages } from "@/lib/i18n";

export default function LanguagesAdminPage() {
  return (
    <main className="min-h-screen bg-[#08101f] p-10 text-white">
      <h1 className="text-6xl font-black">Language Administration</h1>

      <div className="mt-12 grid gap-6 lg:grid-cols-4">
        {supportedLanguages.map((language) => (
          <div
            key={language.code}
            className="rounded-2xl border border-white/10 bg-[#101a2f] p-8"
          >
            <h2 className="text-3xl font-black">{language.nativeLabel}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-blue-300">
              {language.code}
            </p>
            <p className="mt-4 text-gray-400">Translation Active</p>
          </div>
        ))}
      </div>
    </main>
  );
}
