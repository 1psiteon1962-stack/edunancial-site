"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: "general",
    title: "General",
    items: [
      {
        id: "general-what-is-edunancial",
        question: "What is Edunancial?",
        answer:
          "Edunancial is a financial literacy education platform with courses, ebooks, and guided learning paths designed to help members build practical money skills at their own pace.",
      },
      {
        id: "general-who-is-it-for",
        question: "Who is Edunancial designed for?",
        answer:
          "Edunancial supports learners at every stage, including students, families, professionals, entrepreneurs, and anyone who wants to strengthen their financial decision-making.",
      },
      {
        id: "general-how-do-i-start",
        question: "How do I get started on the platform?",
        answer:
          "Create your account, choose a membership tier, and start with a beginner-friendly course or ebook from your dashboard. Progress is saved automatically.",
      },
    ],
  },
  {
    id: "membership",
    title: "Membership",
    items: [
      {
        id: "membership-tiers",
        question: "What membership tiers are available?",
        answer:
          "Edunancial offers Free, Plus, and Premium memberships. Free includes limited access, Plus unlocks the full learning catalog, and Premium adds certificates, downloads, and priority support.",
      },
      {
        id: "membership-upgrade",
        question: "Can I upgrade my membership later?",
        answer:
          "Yes. You can upgrade from Free to Plus or Premium at any time from your membership settings, and your new benefits are activated immediately after payment is confirmed.",
      },
      {
        id: "membership-cancel",
        question: "What happens if I cancel my membership?",
        answer:
          "If you cancel, your plan stays active through the end of the current billing period. After that, your account moves to the Free tier unless you renew.",
      },
      {
        id: "membership-family",
        question: "Do memberships cover family members?",
        answer:
          "Standard memberships are intended for one learner. If you need access for multiple users, contact support for family or group options.",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing",
    items: [
      {
        id: "billing-payment-methods",
        question: "Which payment methods do you accept?",
        answer:
          "Edunancial accepts major credit and debit cards for recurring subscriptions. Additional payment options may be available during special promotions.",
      },
      {
        id: "billing-invoices",
        question: "Where can I find invoices and receipts?",
        answer:
          "You can download invoices and receipts from your billing history inside your account dashboard after each successful payment.",
      },
      {
        id: "billing-refunds",
        question: "Do you offer refunds?",
        answer:
          "Refund eligibility depends on the timing and account activity associated with the charge. Submit a support ticket with your order details so the billing team can review your request.",
      },
      {
        id: "billing-failed-payment",
        question: "What should I do if my renewal payment fails?",
        answer:
          "Update your saved payment method and verify that your bank has approved the charge. The system will usually retry automatically after the payment method is corrected.",
      },
    ],
  },
  {
    id: "technical",
    title: "Technical",
    items: [
      {
        id: "technical-supported-devices",
        question: "Which devices and browsers are supported?",
        answer:
          "Edunancial works best on current versions of Chrome, Safari, Firefox, and Edge on desktop and mobile devices. Keeping your browser updated is recommended.",
      },
      {
        id: "technical-video-buffering",
        question: "Why are my videos buffering or freezing?",
        answer:
          "Buffering is usually caused by network speed, browser cache, or device performance. Try refreshing the page, switching networks, or lowering video quality.",
      },
      {
        id: "technical-login",
        question: "What should I do if I cannot log in?",
        answer:
          "First confirm your email and password, then try resetting your password if needed. Clearing your browser cache and cookies can also resolve repeated login issues.",
      },
      {
        id: "technical-downloads",
        question: "Can I access content offline?",
        answer:
          "Offline downloads are available on supported plans and devices. If you do not see a download option, confirm that your membership includes offline access.",
      },
    ],
  },
  {
    id: "courses",
    title: "Courses",
    items: [
      {
        id: "courses-enroll",
        question: "How do I enroll in a course?",
        answer:
          "Open the course catalog, choose a course, and select the enroll button. The course will appear on your dashboard and your progress will begin tracking right away.",
      },
      {
        id: "courses-certificates",
        question: "Do all courses include certificates?",
        answer:
          "Certificates are available for eligible courses and membership tiers. When a course includes a certificate, it will be noted on the course details page.",
      },
      {
        id: "courses-progress",
        question: "Will the platform save my course progress automatically?",
        answer:
          "Yes. Your completed lessons, quiz scores, and progress percentages are saved to your account so you can resume learning from any supported device.",
      },
      {
        id: "courses-retake",
        question: "Can I retake a quiz or lesson?",
        answer:
          "Yes. Most quizzes and lessons can be reviewed or retaken, which helps learners revisit key concepts before completing a course or earning a certificate.",
      },
    ],
  },
  {
    id: "account",
    title: "Account",
    items: [
      {
        id: "account-change-email",
        question: "How do I change my email address?",
        answer:
          "Open your account settings, choose the email update option, and confirm the change using the verification link sent to your new address.",
      },
      {
        id: "account-reset-password",
        question: "How can I reset my password?",
        answer:
          "Use the forgot password link on the sign-in page. After you submit your email address, you will receive instructions to create a new password securely.",
      },
      {
        id: "account-delete",
        question: "Can I request deletion of my account?",
        answer:
          "Yes. Submit a privacy or account support request if you want your account deleted, and the team will explain the process and any data retention requirements.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    items: [
      {
        id: "privacy-data-use",
        question: "How does Edunancial use my personal data?",
        answer:
          "Your data is used to deliver your learning experience, process billing, maintain security, and improve the platform. Edunancial does not sell member data to advertisers.",
      },
      {
        id: "privacy-data-request",
        question: "Can I request a copy of my data?",
        answer:
          "Yes. Members may submit a privacy-related support request to receive a copy of the personal data associated with their account, subject to verification.",
      },
      {
        id: "privacy-security",
        question: "How do I make my account more secure?",
        answer:
          "Use a strong password, update it regularly, and enable two-factor authentication if it is available on your account. Avoid sharing your login details with anyone.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    items: [
      {
        id: "contact-support",
        question: "What is the best way to contact support?",
        answer:
          "The fastest option is to submit a support ticket through the platform. This ensures your request is routed to the right team and includes your account details.",
      },
      {
        id: "contact-response-time",
        question: "How quickly does support respond?",
        answer:
          "Response times vary by issue type and membership tier, but most general requests receive a reply within one business day. Billing and security issues are prioritized.",
      },
      {
        id: "contact-sales",
        question: "How do I contact Edunancial about partnerships or group access?",
        answer:
          "Use the contact page or submit a ticket describing your organization, learner count, and goals so the team can follow up with the right next steps.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCategories = useMemo(
    () =>
      faqCategories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) =>
            item.question.toLowerCase().includes(normalizedQuery),
          ),
        }))
        .filter((category) => category.items.length > 0),
    [normalizedQuery],
  );

  function toggleItem(id: string) {
    setExpandedItems((currentItems) => {
      const nextItems = new Set(currentItems);

      if (nextItems.has(id)) {
        nextItems.delete(id);
      } else {
        nextItems.add(id);
      }

      return nextItems;
    });
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">FAQ</p>
          <h1 className="mt-6 text-5xl font-black md:text-6xl">Frequently Asked Questions</h1>
          <p className="mt-6 text-lg text-slate-300">
            Search common questions about memberships, courses, billing, certificates, and support.
          </p>
          <div className="mt-10 rounded-xl border border-white/10 bg-[#101a2f] p-6">
            <label htmlFor="faq-search" className="mb-3 block text-sm font-bold text-slate-300">
              Search questions
            </label>
            <input
              id="faq-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by question..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-16 space-y-10">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <section key={category.id} aria-labelledby={`faq-category-${category.id}`}>
                <h2
                  id={`faq-category-${category.id}`}
                  className="text-3xl font-black text-white"
                >
                  {category.title}
                </h2>
                <div className="mt-6 space-y-4">
                  {category.items.map((item) => {
                    const isExpanded = expandedItems.has(item.id);

                    return (
                      <article
                        key={item.id}
                        className="rounded-xl border border-white/10 bg-slate-900 p-8"
                      >
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-controls={`faq-answer-${item.id}`}
                          onClick={() => toggleItem(item.id)}
                          className="flex w-full items-center justify-between gap-6 text-left"
                        >
                          <span className="text-xl font-black text-white">{item.question}</span>
                          <span className="text-2xl font-bold text-blue-400" aria-hidden="true">
                            {isExpanded ? "−" : "+"}
                          </span>
                        </button>
                        {isExpanded ? (
                          <div
                            id={`faq-answer-${item.id}`}
                            className="mt-4 border-t border-white/10 pt-4 text-slate-300"
                          >
                            <p>{item.answer}</p>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-slate-900 p-8 text-slate-300">
              No questions matched your search. Try a different keyword.
            </div>
          )}
        </div>

        <section className="mt-24 rounded-xl border border-white/10 bg-[#101a2f] p-8 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            Need More Help?
          </p>
          <h2 className="mt-4 text-4xl font-black">Contact Support</h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            If you still need assistance, submit a ticket and the Edunancial support team will
            follow up with you directly.
          </p>
          <div className="mt-8">
            <Link
              href="/support/new"
              className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
