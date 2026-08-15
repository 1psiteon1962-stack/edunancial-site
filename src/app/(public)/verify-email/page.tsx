export const metadata = {
  title: "Verify Email | Edunancial",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>;
}) {
  const params = await searchParams;
  const verified = params.verified === "1";

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <div className={`rounded-2xl border p-10 ${verified ? "border-green-700 bg-green-950/20" : "border-blue-700 bg-blue-950/20"}`}>
        <h1 className="text-4xl font-bold">{verified ? "Email verified" : "Verify Your Email"}</h1>
        <p className="mt-8 leading-8 text-slate-300">
          {verified
            ? "Your email address has been verified. You can now continue securely into your member dashboard."
            : "We've sent a verification email to the address you provided. Please click the verification link before signing in."}
        </p>
      </div>
    </main>
  );
}
