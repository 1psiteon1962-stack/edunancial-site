const languages = [
  { name: "English", code: "en", completeness: "100%", contentPieces: 0 },
  { name: "Spanish", code: "es", completeness: "85%", contentPieces: 0 },
  { name: "French", code: "fr", completeness: "60%", contentPieces: 0 },
  { name: "Portuguese", code: "pt", completeness: "50%", contentPieces: 0 },
  { name: "Arabic", code: "ar", completeness: "20%", contentPieces: 0 },
  { name: "Japanese", code: "ja", completeness: "10%", contentPieces: 0 },
  { name: "Korean", code: "ko", completeness: "10%", contentPieces: 0 },
  { name: "German", code: "de", completeness: "15%", contentPieces: 0 },
  { name: "Italian", code: "it", completeness: "15%", contentPieces: 0 },
];

export default function LanguageDashboard() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Global
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Language Dashboard
        </h1>
        <p className="mt-3 text-gray-400">
          Translation progress and localization status across all supported languages.
        </p>
      </div>

      <div className="grid gap-4 mb-10">
        {languages.map((lang) => (
          <div key={lang.code} className="rounded-2xl bg-[#101a2f] border border-white/10 p-5 flex items-center gap-6">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-xs font-bold text-blue-400 uppercase shrink-0">
              {lang.code}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{lang.name}</span>
                <span className="text-sm text-gray-400">{lang.completeness}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: lang.completeness }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold">{lang.contentPieces}</p>
              <p className="text-xs text-gray-400">pieces</p>
            </div>
            <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold shrink-0">
              Manage
            </button>
          </div>
        ))}
      </div>

    </main>
  );
}
