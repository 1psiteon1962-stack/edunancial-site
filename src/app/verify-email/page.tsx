export const metadata = {
  title: "Verify Email | Edunancial",
};

export default function VerifyEmailPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">

      <div className="rounded-2xl border border-green-700 bg-green-950/20 p-10">

        <h1 className="text-4xl font-bold">
          Verify Your Email
        </h1>

        <p className="mt-8 leading-8 text-slate-300">
          We've sent a verification email to the address you provided.
          Please click the verification link before signing in.
        </p>

      </div>

    </main>
  );
}
