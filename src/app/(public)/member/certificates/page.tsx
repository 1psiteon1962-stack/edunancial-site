export const metadata = {
  title: "Certificates | Edunancial",
};

export default function CertificatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="text-4xl font-bold">
        My Certificates
      </h1>

      <p className="mt-6 max-w-3xl text-slate-300">
        As you complete assessments, learning paths, and educational
        milestones, your certificates will appear here for download
        and verification.
      </p>

      <div className="mt-16 rounded-xl border border-slate-700 bg-slate-900/60 p-12 text-center">

        No certificates have been earned yet.

      </div>

    </main>
  );
}
