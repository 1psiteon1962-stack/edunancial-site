import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-slate-900/70 p-10">
        <h1 className="text-5xl font-black">Welcome to Edunancial Membership</h1>
        <p className="mt-4 text-lg text-slate-300">
          Your account and membership access were provisioned from verified payment.
          Follow this quick path to start learning immediately.
        </p>
        <ol className="mt-8 space-y-4 text-slate-200">
          <li>1. Open your Member Dashboard.</li>
          <li>2. Start your first recommended lesson.</li>
          <li>3. Use AI Financial Coach support when needed.</li>
          <li>4. Track progress and continue to the next recommended course.</li>
        </ol>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/dashboard" className="rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700">
            Open Dashboard
          </Link>
          <Link href="/courses" className="rounded-xl border border-white/30 px-6 py-3 font-bold hover:bg-white hover:text-slate-950">
            Start First Lesson
          </Link>
        </div>
      </div>
    </main>
  );
}
