import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-6xl font-black text-green-500">
          Payment Received
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xl text-gray-300">
          Your membership provisioning is handled automatically after verified Square payment.
          Continue through the launch journey below.
        </p>

        <div className="mt-12 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:grid-cols-2">
          {[
            { label: "Welcome", href: "/welcome" },
            { label: "Member Dashboard", href: "/dashboard" },
            { label: "Recommended First Lesson", href: "/courses" },
            { label: "AI Financial Coach", href: "/ai-coach" },
            { label: "Progress Tracking", href: "/course-progress" },
            { label: "Next Recommended Course", href: "/continue-learning" },
          ].map((step) => (
            <Link
              key={step.label}
              href={step.href}
              className="rounded-xl border border-blue-500/40 bg-blue-700/40 px-5 py-4 text-center font-bold transition hover:bg-blue-600"
            >
              {step.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
