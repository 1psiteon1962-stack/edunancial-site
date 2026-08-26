import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

type Credential = {
  id: string;
  credential_code: string;
  user_id: string;
  credential_type: string;
  title: string;
  track_code: string | null;
  level_code: string | null;
  status: string;
  issued_at: string;
};

async function getCredentials(): Promise<{ rows: Credential[]; available: boolean }> {
  try {
    const supabase = getKpiSupabaseAdmin();
    const { data, error } = await supabase
      .from("learning_credentials")
      .select("id,credential_code,user_id,credential_type,title,track_code,level_code,status,issued_at")
      .order("issued_at", { ascending: false })
      .limit(100);
    if (error) return { rows: [], available: false };
    return { rows: (data ?? []) as Credential[], available: true };
  } catch {
    return { rows: [], available: false };
  }
}

export default async function CertificateManager() {
  const { rows, available } = await getCredentials();
  const active = rows.filter((row) => row.status === "ACTIVE").length;
  const readiness = rows.filter((row) => row.credential_type === "BUSINESS_READINESS").length;

  return (
    <main className="min-h-screen bg-[#08101f] p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">Verifiable credentialing</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Edunancial Credentials</h1>
        <p className="mt-5 max-w-4xl text-lg text-gray-300">
          Credentials are evidence-backed records, not decorative participation certificates. The foundation supports level completion, discipline credentials, and future Business Readiness credentials for employer, lender, incubator, accelerator, mentor, investor and capital-readiness use.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <section className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><p className="text-sm uppercase tracking-wide text-gray-400">Credential records</p><p className="mt-2 text-4xl font-black">{available ? rows.length : "—"}</p></section>
          <section className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><p className="text-sm uppercase tracking-wide text-gray-400">Active credentials</p><p className="mt-2 text-4xl font-black">{available ? active : "—"}</p></section>
          <section className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><p className="text-sm uppercase tracking-wide text-gray-400">Business readiness</p><p className="mt-2 text-4xl font-black">{available ? readiness : "—"}</p></section>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#101a2f]">
          <div className="border-b border-white/10 p-6">
            <h2 className="text-2xl font-black">Issued credentials</h2>
            <p className="mt-2 text-sm text-gray-400">Each credential has a stable verification code and an evidence record.</p>
          </div>
          {!available ? (
            <p className="p-6 text-amber-200">Credential storage is not available in this environment. Apply the learning_credentials migration before issuance.</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-gray-400">No credentials have been earned yet. Credentials appear here only after their evidence requirements are satisfied.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="border-b border-white/10 bg-black/20 text-gray-400"><tr><th className="p-4">Credential</th><th className="p-4">Learner</th><th className="p-4">Track / Level</th><th className="p-4">Issued</th><th className="p-4">Status</th></tr></thead>
                <tbody>{rows.map((row) => <tr key={row.id} className="border-b border-white/5"><td className="p-4"><div className="font-bold">{row.title}</div><div className="mt-1 font-mono text-xs text-blue-300">{row.credential_code}</div></td><td className="p-4 font-mono text-xs text-gray-300">{row.user_id}</td><td className="p-4">{[row.track_code, row.level_code].filter(Boolean).join(" / ") || row.credential_type}</td><td className="p-4">{new Date(row.issued_at).toLocaleDateString("en-US")}</td><td className="p-4 font-bold">{row.status}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
          <h2 className="text-xl font-black text-emerald-100">Credential ladder</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-50/80">Level completion is the first evidence-backed credential. Higher Edunancial credentials will add assessment performance, applied projects, mentor validation and business-readiness milestones so outside organizations can evaluate what the learner actually demonstrated.</p>
        </section>
      </div>
    </main>
  );
}
