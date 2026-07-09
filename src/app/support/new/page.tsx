"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import type { TicketCategory, TicketPriority } from "@/types/support";

const categories: TicketCategory[] = [
  "General",
  "Membership",
  "Billing",
  "Technical",
  "Course",
  "Account",
  "Privacy",
  "Other",
];

const priorities: TicketPriority[] = ["low", "medium", "high", "urgent"];

const formatPriorityLabel = (priority: TicketPriority) =>
  priority.charAt(0).toUpperCase() + priority.slice(1);

export default function NewSupportTicketPage() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("General");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [description, setDescription] = useState("");
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTicketNumber(`TKT-${Date.now().toString().slice(-6)}`);
  };

  const resetForm = () => {
    setSubject("");
    setCategory("General");
    setPriority("medium");
    setDescription("");
    setTicketNumber(null);
  };

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="max-w-6xl mx-auto px-6 py-24">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/support" className="hover:text-blue-400">
                Support
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-white">New Ticket</li>
          </ol>
        </nav>

        {!ticketNumber ? (
          <div className="mt-8 rounded-xl bg-slate-900 p-8 border border-white/10">
            <p className="text-yellow-400 uppercase tracking-[0.45em] font-bold text-sm">
              SUBMIT A TICKET
            </p>
            <h1 className="mt-6 text-5xl font-black">New Support Ticket</h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              Share the details below and our team will route your request to the
              right specialist.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="subject" className="text-sm font-bold text-slate-300 mb-2 block">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none w-full"
                  placeholder="Brief summary of your issue"
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="category" className="text-sm font-bold text-slate-300 mb-2 block">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value as TicketCategory)}
                    className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none w-full"
                  >
                    {categories.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="text-sm font-bold text-slate-300 mb-2 block">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as TicketPriority)}
                    className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none w-full"
                  >
                    {priorities.map((option) => (
                      <option key={option} value={option}>
                        {formatPriorityLabel(option)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-bold text-slate-300 mb-2 block">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={6}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none w-full"
                  placeholder="Tell us what happened, what you expected, and any steps you already tried."
                  required
                />
              </div>

              <p className="text-sm text-slate-400">
                File attachments supported — please email attachments to
                {" "}
                <a href="mailto:support@edunancial.com" className="text-blue-400 hover:text-blue-300">
                  support@edunancial.com
                </a>
              </p>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-8 rounded-xl bg-slate-900 p-8 border border-white/10">
            <p className="text-yellow-400 uppercase tracking-[0.45em] font-bold text-sm">
              TICKET CREATED
            </p>
            <h1 className="mt-6 text-5xl font-black">We&apos;ve received your request</h1>
            <p className="mt-4 text-slate-300">
              Your mock ticket number is <span className="text-blue-400 font-bold">{ticketNumber}</span>.
              Our support team will follow up as soon as possible.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/support/tickets"
                className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500 text-center"
              >
                View My Tickets
              </Link>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-white/10 px-5 py-3 font-bold hover:border-blue-500"
              >
                Submit Another Ticket
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
