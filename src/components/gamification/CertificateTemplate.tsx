import type { UserCertificate } from "@/lib/gamification/types";
import { getTemplateById } from "@/lib/gamification/certificateEngine";

interface Props {
  certificate: UserCertificate;
  /** Show full detail view. Default: false (card mode) */
  detailed?: boolean;
}

export default function CertificateTemplate({ certificate, detailed = false }: Props) {
  const template = getTemplateById(certificate.templateId);

  if (detailed) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-yellow-500 bg-[#0a0f1e] p-8 text-white"
        role="article"
        aria-label={`Certificate: ${certificate.credentialTitle}`}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 h-16 w-16 border-t-4 border-l-4 border-yellow-500 rounded-tl-2xl" aria-hidden="true" />
        <div className="absolute top-0 right-0 h-16 w-16 border-t-4 border-r-4 border-yellow-500 rounded-tr-2xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 h-16 w-16 border-b-4 border-l-4 border-yellow-500 rounded-bl-2xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 h-16 w-16 border-b-4 border-r-4 border-yellow-500 rounded-br-2xl" aria-hidden="true" />

        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-yellow-400 font-bold">
            Certificate of Achievement
          </p>

          <p className="text-sm text-slate-400">This certifies that</p>

          <p className="text-4xl font-black text-white">{certificate.studentName}</p>

          <p className="text-sm text-slate-400">has successfully completed</p>

          <p className="text-3xl font-black text-yellow-400">{certificate.credentialTitle}</p>

          {template && (
            <p className="text-sm text-slate-400 max-w-md mx-auto">{template.description}</p>
          )}

          <div className="flex justify-center gap-12 pt-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Issued</p>
              <p className="text-sm font-semibold">
                {new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Certificate No.</p>
              <p className="text-sm font-mono font-semibold">{certificate.certificateNumber}</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4 flex-wrap">
            <a
              href={certificate.verificationUrl}
              className="rounded-lg border border-slate-600 px-5 py-2 text-sm font-semibold hover:border-yellow-500 hover:text-yellow-400 transition-colors"
            >
              Verify Certificate
            </a>
            {certificate.pdfUrl ? (
              <a
                href={certificate.pdfUrl}
                download
                className="rounded-lg bg-yellow-500 px-5 py-2 text-sm font-bold text-black hover:bg-yellow-400 transition-colors"
              >
                Download PDF
              </a>
            ) : (
              <button
                disabled
                className="rounded-lg bg-slate-700 px-5 py-2 text-sm font-bold text-slate-400 cursor-not-allowed"
                title="PDF download coming soon"
              >
                Download PDF
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Card mode
  return (
    <div
      className="rounded-xl border border-yellow-600/40 bg-slate-900 p-6 hover:border-yellow-500 transition-colors"
      role="article"
      aria-label={`Certificate: ${certificate.credentialTitle}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-yellow-400 font-semibold">
            {template?.type.replace(/_/g, " ") ?? "Certificate"}
          </p>
          <h3 className="mt-1 text-xl font-black">{certificate.credentialTitle}</h3>
          <p className="mt-1 text-sm text-slate-400">
            Issued {new Date(certificate.issuedAt).toLocaleDateString()}
          </p>
          <p className="mt-0.5 text-xs font-mono text-slate-500">
            {certificate.certificateNumber}
          </p>
        </div>
        <span className="text-3xl" role="img" aria-label="Certificate">🎓</span>
      </div>

      <div className="mt-4 flex gap-3">
        <a
          href={certificate.verificationUrl}
          className="rounded-lg border border-slate-600 px-4 py-1.5 text-xs font-semibold hover:border-yellow-500 transition-colors"
        >
          Verify
        </a>
        {certificate.pdfUrl ? (
          <a
            href={certificate.pdfUrl}
            download
            className="rounded-lg bg-yellow-500 px-4 py-1.5 text-xs font-bold text-black hover:bg-yellow-400 transition-colors"
          >
            Download
          </a>
        ) : (
          <button
            disabled
            className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
            title="PDF download coming soon"
          >
            Download (Soon)
          </button>
        )}
      </div>
    </div>
  );
}
