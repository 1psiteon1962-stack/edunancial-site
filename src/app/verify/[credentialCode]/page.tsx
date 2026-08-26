import { notFound } from "next/navigation";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

type CredentialRow = {
  credential_code: string;
  title: string;
  credential_type: "LEVEL" | "TRACK" | "BUSINESS_READINESS";
  track_code: string | null;
  level_code: string | null;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  evidence: Record<string, unknown> | null;
  competencies: unknown[] | null;
  issuer_name: string;
  issued_at: string;
  expires_at: string | null;
};

export const dynamic = "force-dynamic";

export default async function CredentialVerificationPage({
  params,
}: {
  params: Promise<{ credentialCode: string }>;
}) {
  const { credentialCode } = await params;
  const code = credentialCode.trim().toUpperCase();

  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("learning_credentials")
    .select(
      "credential_code,title,credential_type,track_code,level_code,status,evidence,competencies,issuer_name,issued_at,expires_at"
    )
    .eq("credential_code", code)
    .maybeSingle();

  if (error || !data) notFound();

  const credential = data as CredentialRow;
  const active = credential.status === "ACTIVE";

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
          Edunancial Credential Verification
        </p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">{credential.title}</h1>

        <div
          className={`mt-8 rounded-2xl border p-6 ${
            active
              ? "border-emerald-400/30 bg-emerald-400/10"
              : "border-red-400/30 bg-red-400/10"
          }`}
        >
          <p className="text-sm font-black uppercase tracking-wide">
            Verification status
          </p>
          <p className="mt-2 text-3xl font-black">{credential.status}</p>
          <p className="mt-2 text-sm opacity-80">
            Credential code: <strong>{credential.credential_code}</strong>
          </p>
        </div>

        <dl className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-[#101a2f] p-6 md:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-400">Issuer</dt>
            <dd className="mt-1 font-bold">{credential.issuer_name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Credential type</dt>
            <dd className="mt-1 font-bold">{credential.credential_type.replaceAll("_", " ")}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Track</dt>
            <dd className="mt-1 font-bold">{credential.track_code ?? "Cross-disciplinary"}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Level</dt>
            <dd className="mt-1 font-bold">{credential.level_code ?? "Integrated"}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Issued</dt>
            <dd className="mt-1 font-bold">{new Date(credential.issued_at).toLocaleDateString("en-US")}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Expires</dt>
            <dd className="mt-1 font-bold">
              {credential.expires_at
                ? new Date(credential.expires_at).toLocaleDateString("en-US")
                : "No expiration"}
            </dd>
          </div>
        </dl>

        <section className="mt-8 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <h2 className="text-xl font-black">Evidence and competencies</h2>
          <p className="mt-3 text-sm leading-6 text-gray-300">
            This credential is backed by Edunancial learning records. Level-completion
            credentials currently require documented lesson completion. Advanced
            credentials may additionally include assessments, applied projects,
            mentor validation, and business-readiness milestones.
          </p>

          <div className="mt-5 rounded-xl bg-black/20 p-4 text-sm text-gray-300">
            <p>
              <strong>Evidence source:</strong>{" "}
              {String(credential.evidence?.source ?? "Edunancial credential record")}
            </p>
            <p className="mt-2">
              <strong>Completed lessons:</strong>{" "}
              {String(credential.evidence?.completed_lessons ?? "Not applicable")}
            </p>
          </div>
        </section>

        <p className="mt-8 text-xs leading-5 text-gray-500">
          Verification confirms that this credential record was issued by Edunancial
          and is currently recorded with the status shown above. It does not represent
          a guarantee of employment, financing, investment performance, or business success.
        </p>
      </div>
    </main>
  );
}
