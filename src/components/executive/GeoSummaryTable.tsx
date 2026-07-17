import type { GeoDataPoint } from "@/lib/executive/types";

interface Props {
  data: GeoDataPoint[];
}

export default function GeoSummaryTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-[#101a2f] p-8 text-center text-sm text-slate-500">
        Geographic data not yet available. Connect Supabase geo_analytics to populate this table.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 text-xs text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">Region</th>
            <th className="px-4 py-3 text-left">Country</th>
            <th className="px-4 py-3 text-right">Members</th>
            <th className="px-4 py-3 text-right">Revenue</th>
            <th className="px-4 py-3 text-right">Traffic</th>
            <th className="px-4 py-3 text-right">Completions</th>
            <th className="px-4 py-3 text-right">AI Usage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-[#101a2f]">
          {data.map((row) => (
            <tr key={row.countryCode} className="hover:bg-white/5">
              <td className="px-4 py-3 text-slate-400">{row.continent}</td>
              <td className="px-4 py-3 font-medium">{row.country}</td>
              <td className="px-4 py-3 text-right">{row.members.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">${row.revenue.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">{row.traffic.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">{row.courseCompletions.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">{row.aiUsage.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
