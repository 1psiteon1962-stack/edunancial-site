export default function CredentialVerificationIndex() {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
          Edunancial Credentials
        </p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Verify a credential</h1>
        <p className="mt-5 text-lg leading-7 text-gray-300">
          Edunancial credentials are designed to document demonstrated learning and,
          for advanced credentials, applied entrepreneurial readiness. A credential
          holder can provide the complete verification address containing their
          unique credential code.
        </p>

        <section className="mt-10 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <h2 className="text-xl font-black">Verification format</h2>
          <p className="mt-3 text-gray-300">
            Credential verification pages use the format
            <code className="ml-2 rounded bg-black/30 px-2 py-1 text-blue-200">
              /verify/EDU-XXXXXXXXXXXX
            </code>
          </p>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            The verification page reports the credential&apos;s current status,
            issuing organization, type, track/level, issue date, and available
            evidence without exposing the learner&apos;s private account information.
          </p>
        </section>
      </div>
    </main>
  );
}
