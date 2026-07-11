import { getRegionalManagementRows } from "@/lib/localization";

export default function RegionalManagementPage() {
  const regions = getRegionalManagementRows();

  return (
    <main className="min-h-screen bg-[#08101f] p-10 text-white">
      <h1 className="text-5xl font-black">Regional Management</h1>
      <p className="mt-4 text-gray-300">
        Manage region activation, localization, legal notices, and payment
        routing architecture.
      </p>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-[#101a2f]">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-gray-400">
            <tr>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Enabled</th>
              <th className="px-4 py-3">Currencies</th>
              <th className="px-4 py-3">Languages</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Translation</th>
              <th className="px-4 py-3">Localization</th>
              <th className="px-4 py-3">Legal Notices</th>
              <th className="px-4 py-3">Payment Routing</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr key={region.slug} className="border-b border-white/5">
                <td className="px-4 py-4 font-semibold">{region.name}</td>
                <td className="px-4 py-4">{region.enabled ? "Enabled" : "Disabled"}</td>
                <td className="px-4 py-4">{region.supportedCurrencies.join(", ")}</td>
                <td className="px-4 py-4">{region.supportedLanguages.join(", ")}</td>
                <td className="px-4 py-4">{region.status}</td>
                <td className="px-4 py-4">{region.translationCompletion}%</td>
                <td className="px-4 py-4">{region.localizationCompletion}%</td>
                <td className="px-4 py-4">{region.legalNoticeCount}</td>
                <td className="px-4 py-4">Configured in localization engine</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
