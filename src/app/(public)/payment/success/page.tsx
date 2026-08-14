"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const params = useSearchParams();
  const plan = params.get("plan");
  const itemType = params.get("type");
  const contentId = params.get("content");

  const isMembership =
    !itemType ||
    itemType === "membership_monthly" ||
    itemType === "membership_annual";

  const titleText = isMembership
    ? "Membership Activated"
    : itemType === "course"
    ? "Course Access Granted"
    : itemType === "book"
    ? "Book Purchase Complete"
    : itemType === "event_registration"
    ? "Registration Confirmed"
    : "Payment Received";

  const descriptionText = isMembership
    ? "Your membership is being activated automatically after Square payment verification. Continue to your dashboard below."
    : contentId
    ? `Access to ${contentId.replace(/-/g, " ")} is being provisioned.`
    : "Your purchase is confirmed. Your access will be activated after payment verification.";

  const nextSteps = isMembership
    ? [
        { label: "Member Dashboard", href: "/dashboard" },
        { label: "Recommended First Lesson", href: "/courses" },
        { label: "AI Financial Coach", href: "/ai-coach" },
        { label: "Progress Tracking", href: "/course-progress" },
        { label: "Welcome", href: "/welcome" },
        { label: "Continue Learning", href: "/continue-learning" },
      ]
    : itemType === "course"
    ? [
        { label: "Start Course", href: contentId ? `/courses/${contentId}` : "/courses" },
        { label: "My Dashboard", href: "/dashboard" },
      ]
    : [
        { label: "My Dashboard", href: "/dashboard" },
        { label: "Browse Courses", href: "/courses" },
      ];

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="text-7xl mb-4" aria-hidden="true">
            ✅
          </div>
          <h1 className="text-5xl font-black text-green-400 sm:text-6xl">
            {titleText}
          </h1>

          {plan && (
            <p className="mt-4 inline-block rounded-full bg-green-900/40 border border-green-500/30 px-4 py-1 text-sm text-green-300">
              {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
            </p>
          )}

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            {descriptionText}
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">
            A confirmation email will be sent shortly. Access is only granted
            after server-side payment verification — not based on this browser
            redirect.
          </p>
        </div>

        <div className="mt-12 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:grid-cols-2 lg:grid-cols-3">
          {nextSteps.map((step) => (
            <Link
              key={step.label}
              href={step.href}
              className="rounded-xl border border-blue-500/40 bg-blue-700/40 px-5 py-4 text-center font-bold transition hover:bg-blue-600"
            >
              {step.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-4 text-center text-sm text-slate-400">
          Need help?{" "}
          <Link href="/contact" className="text-blue-400 hover:text-blue-300">
            Contact support
          </Link>{" "}
          or visit our{" "}
          <Link href="/faq" className="text-blue-400 hover:text-blue-300">
            FAQ
          </Link>
          .
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-white">
          <p className="text-xl">Loading…</p>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
