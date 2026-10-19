import { listBetaFeedback, type BetaFeedbackRecord } from "@/lib/member/beta-feedback";

/** Owner view of server-stored beta tester feedback (newest first). */
export default async function BetaFeedbackList() {
  let rows: BetaFeedbackRecord[] = [];
  let error = "";
  try {
    rows = await listBetaFeedback(200);
  } catch (e) {
    error = e instanceof Error ? e.message : "Feedback storage unavailable.";
  }
  return (
    <section className="mx-auto mt-10 max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <h2 className="text-2xl font-black">Beta tester feedback</h2>
      <p className="mt-1 text-sm text-slate-400">Submitted from /beta/feedback by signed-in testers. Newest first (up to 200).</p>
      {error ? <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">{error}</p> : null}
      {!error && rows.length === 0 ? <p className="mt-6 text-slate-400">No feedback has been submitted yet.</p> : null}
      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl bg-black/20 p-4 text-sm">
            <div className="flex flex-wrap gap-4 text-xs font-bold uppercase text-blue-300">
              <span>{row.submittedAt.slice(0, 16).replace("T", " ")} UTC</span>
              <span>Rating {row.rating}/5</span>
              <span>{row.email ?? row.userId}</span>
              {row.countryRegion ? <span>{row.countryRegion}</span> : null}
            </div>
            <dl className="mt-3 grid gap-2">
              <div><dt className="font-semibold text-slate-300">Strongest part</dt><dd className="whitespace-pre-wrap">{row.strongestFeature}</dd></div>
              <div><dt className="font-semibold text-slate-300">Improve before release</dt><dd className="whitespace-pre-wrap">{row.improvementRequest}</dd></div>
              <div><dt className="font-semibold text-slate-300">Confusing / slowed down</dt><dd className="whitespace-pre-wrap">{row.confusingMoment}</dd></div>
              <div><dt className="font-semibold text-slate-300">Practical outcome</dt><dd className="whitespace-pre-wrap">{row.practicalOutcome}</dd></div>
              {row.additionalNotes ? <div><dt className="font-semibold text-slate-300">Other notes</dt><dd className="whitespace-pre-wrap">{row.additionalNotes}</dd></div> : null}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
