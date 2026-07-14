import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Edunancial",
  description: "Get in touch with the Edunancial team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold text-sm">
          CONTACT EDUNANCIAL
        </p>

        <h1 className="mt-6 text-5xl font-black md:text-6xl">
          We&rsquo;re Here To Help
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Have a question about membership, courses, or the platform? Reach out and
          a member of the Edunancial team will respond as soon as possible.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          {/* Primary contact */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-black">General &amp; Support</h2>
            <p className="mt-4 text-slate-300 leading-7">
              For questions about membership, courses, billing, or anything else,
              please contact us through our general support address below.
            </p>
            <p className="mt-6 font-bold text-blue-400">support@edunancial.com</p>
            <p className="mt-3 text-sm text-slate-500">
              Departmental email addresses (courses@, billing@, certificates@, etc.) are
              being configured and will be available after launch. All inquiries are
              currently routed through the support address above.
            </p>
          </div>

          {/* Contact form placeholder */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-black">Send a Message</h2>
            <p className="mt-4 text-slate-300 leading-7">
              Use the form below to send a message directly to the Edunancial team.
            </p>
            <form
              action="mailto:support@edunancial.com"
              method="get"
              className="mt-6 space-y-4"
            >
              <div>
                <label htmlFor="contact-name" className="block text-sm font-bold text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-bold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-bold text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="contact-body" className="block text-sm font-bold text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  id="contact-body"
                  name="body"
                  rows={5}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none resize-none"
                  placeholder="Tell us what you need..."
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>

        {/* Deployment note for future departmental email setup */}
        <div className="mt-16 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-black text-slate-300">
            Future Departmental Email Rollout
          </h2>
          <p className="mt-3 text-sm text-slate-500 leading-7">
            The following departmental mailboxes are planned and should be verified and
            activated before being published publicly:{" "}
            <span className="text-slate-400">
              info@, courses@, books@, billing@, certificates@, partnerships@, media@
            </span>.
            Do not publish these addresses until each mailbox has been tested and confirmed
            operational. Route all inquiries through support@ until this checklist is complete.
          </p>
        </div>

      </section>

    </main>
  );
}
