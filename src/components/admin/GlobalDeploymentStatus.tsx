import { REGION_READINESS } from "../../../data/regionReadiness";

export default function GlobalDeploymentStatus() {
  const apacReadiness = REGION_READINESS["asia-pacific"];
  const regions = [
    { name: "North America", status: "Online", countries: 3 },
    { name: "Latin America", status: "Online", countries: 21 },
    { name: "Caribbean", status: "Online", countries: 28 },
    { name: "Europe", status: "Preparing", countries: 44 },
    { name: "Africa", status: "Beta", countries: 54 },
    {
      name: "Asia-Pacific",
      status: apacReadiness.enabled ? "Beta" : "Private",
      countries: 48,
      rolloutMode: apacReadiness.rollout?.founderOnly ? "Founder-gated" : "General",
      beta: apacReadiness.rollout?.betaTestersEnabled ? "Enabled" : "Disabled",
    },
  ];

  return (
    <section className="rounded-xl bg-slate-900 p-8">
      <h2 className="text-3xl font-black text-white">
        Global Deployment Status
      </h2>

      <div className="mt-8 space-y-4">
        {regions.map((r) => (
          <div
            key={r.name}
            className="flex justify-between rounded-lg bg-slate-800 p-4"
          >
            <div>
              <h3 className="font-bold text-white">{r.name}</h3>
              <p className="text-slate-400">{r.countries} Countries</p>
              {"rolloutMode" in r ? (
                <p className="text-xs text-slate-500">
                  {r.rolloutMode} · Beta testers: {r.beta}
                </p>
              ) : null}
            </div>

            <span className="rounded bg-green-600 px-3 py-1 text-white">
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
