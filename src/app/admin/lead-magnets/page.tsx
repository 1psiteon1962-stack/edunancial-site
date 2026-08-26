export default function LeadMagnets() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
          Marketing assets
        </p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Lead Magnet Manager</h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-300">
          The previous upload form and Publish button were not connected to file
          storage, lead records, email delivery, or a public download path, so
          they have been removed.
        </p>

        <section className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
          <h2 className="text-xl font-black text-amber-100">No lead magnets are wired yet.</h2>
          <p className="mt-3 text-sm leading-6 text-amber-50/80">
            This admin surface will only expose publishing controls after the
            complete workflow exists: persistent asset storage, lead-capture
            records, delivery automation, and a customer-facing download or
            access route.
          </p>
        </section>
      </div>
    </main>
  );
}
