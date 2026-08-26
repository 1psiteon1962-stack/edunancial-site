export default function CertificateManager() {
  return (
    <main className="min-h-screen bg-[#08101f] p-6 text-white md:p-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
          Credentialing
        </p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Certificate Manager</h1>
        <p className="mt-5 max-w-3xl text-lg text-gray-300">
          Certificate generation is not exposed as an owner action until it is
          connected to verified course completion, passing criteria, persistent
          certificate records, and a learner-accessible credential.
        </p>

        <section className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
          <h2 className="text-xl font-black text-amber-100">Certificate issuance is not wired yet.</h2>
          <p className="mt-3 text-sm leading-6 text-amber-50/80">
            The previous Generate Certificate button did not create a certificate
            or save a credential record, so it has been removed rather than left
            as a nonfunctional control.
          </p>
        </section>
      </div>
    </main>
  );
}
