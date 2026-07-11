import { PassportCertificate } from "@/lib/competency/types";
import CertificateActions from "./CertificateActions";

interface Props {
  certificates: PassportCertificate[];
}

export default function CertificateGallery({ certificates }: Props) {
  const earned = certificates.filter((c) => c.downloadUrl !== "");
  const pending = certificates.filter((c) => c.downloadUrl === "");

  return (
    <div className="rounded-2xl bg-slate-900 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Certificates</h2>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-bold">
          {earned.length} / {certificates.length}
        </span>
      </div>

      {earned.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-green-400">
            Earned
          </h3>
          {earned.map((cert) => (
            <div
              key={cert.id}
              className="rounded-xl border border-green-500/40 bg-green-950/20 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold">{cert.title}</h4>
                  <p className="mt-1 text-sm text-slate-400">
                    {cert.category} · Issued {cert.issuedDate}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Score: {cert.score}
                  </p>
                </div>
                <div className="text-3xl">📜</div>
              </div>
              <CertificateActions certificate={cert} />
            </div>
          ))}
        </div>
      )}

      {pending.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            In Progress
          </h3>
          {pending.map((cert) => (
            <div
              key={cert.id}
              className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 opacity-60"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold">{cert.title}</h4>
                  <p className="mt-1 text-sm text-slate-400">
                    {cert.category} · Requires score ≥ 80
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Current score: {cert.score}
                  </p>
                </div>
                <div className="text-3xl opacity-30">📜</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
