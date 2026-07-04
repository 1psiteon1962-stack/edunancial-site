export const metadata = {
  title: "Forgot Password | Edunancial",
};

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">

        <h1 className="text-4xl font-bold">
          Reset Your Password
        </h1>

        <p className="mt-6 text-slate-300">
          Enter the email address associated with your membership account.
        </p>

        <form className="mt-10 space-y-6">

          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4"
            type="email"
            placeholder="Email Address"
          />

          <button
            className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white"
            type="submit"
          >
            Send Reset Link
          </button>

        </form>

      </div>

    </main>
  );
}
