export default function LeadCaptureAdmin() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
          Lead operations
        </p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Lead Capture</h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-300">
          The previous destination-email, file-upload, and Publish controls did
          not create a lead form, store a lead, send an email, or publish an
          asset. Those disconnected controls have been removed.
        </p>

        <section className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
          <h2 className="text-xl font-black text-amber-100">Lead capture is not yet operational.</h2>
          <p className="mt-3 text-sm leading-6 text-amber-50/80">
            A real lead-capture workflow needs a public form endpoint, persistent
            lead records, consent/source metadata, and an authenticated admin
            view before this page should expose management controls.
          </p>
        </section>
      </div>
    </main>
  );
}
