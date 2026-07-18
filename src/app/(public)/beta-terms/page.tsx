import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Beta Terms | Edunancial",
  description:
    "Review the invitation-only Edunancial Beta Tester terms, timing rules, and feedback expectations.",
};

export default function BetaTermsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Legal</p>
        <h1 className="mt-4 text-5xl font-black">Beta Terms</h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
          <p>{EDUNANCIAL_IDENTITY}</p>
          <p className="mt-4">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
        </div>

        <div className="mt-10 space-y-8 text-slate-300">
          <section>
            <h2 className="text-3xl font-black text-white">Invitation Only</h2>
            <p className="mt-4 leading-8">
              Beta Tester access is personal, invitation only, single-use, non-transferable, and
              tied to the approved email address shown in the invitation email.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">72-Hour Access Window</h2>
            <p className="mt-4 leading-8">
              The 72-hour beta period begins only on the first successful login after valid pass
              number redemption. It does not begin when the invitation is created or sent.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Expiration and Revocation</h2>
            <p className="mt-4 leading-8">
              Beta access may be revoked at any time. When beta access expires, Edunancial preserves
              your account, progress, and feedback, but beta-only premium access ends and does not
              auto-convert to a paid membership.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Feedback Expectation</h2>
            <p className="mt-4 leading-8">
              Beta testers are expected to provide candid product feedback so Edunancial can improve
              the membership platform before broader release.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
