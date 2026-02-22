import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import { getSiteContext } from "@/lib/kpi/site";
import { redirect } from "next/navigation";

function unauthorized() {
  redirect("/");
}

export default async function AdminKPIPage() {
  const hdrs = headers();
  const authHeader = hdrs.get("authorization");

  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    unauthorized();
  }

  const site = getSiteContext();

  const { data, error } = await supabaseAdmin
    .from("kpi_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold">Admin KPI Dashboard</h1>
        <p className="text-red-500 mt-4">Error loading KPI data.</p>
        <pre className="mt-4 text-sm">{error.message}</pre>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin KPI Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Site Context</h2>
        <pre className="text-sm bg-gray-100 p-4 rounded mt-2">
          {JSON.stringify(site, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent KPI Events</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Event</th>
              <th className="border p-2">Region</th>
              <th className="border p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row: any) => (
              <tr key={row.id}>
                <td className="border p-2">{row.id}</td>
                <td className="border p-2">{row.user_id}</td>
                <td className="border p-2">{row.event_type}</td>
                <td className="border p-2">{row.region}</td>
                <td className="border p-2">{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
