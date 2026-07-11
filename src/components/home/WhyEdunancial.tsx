"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Animated counter hook
   Uses IntersectionObserver to trigger only
   when the element enters the viewport, and
   respects prefers-reduced-motion.
───────────────────────────────────────────── */
function useCountUp(
  target: number,
  duration = 1500,
  isVisible = false,
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }

    let startTime = 0;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, duration, isVisible]);

  return count;
}

/* ─────────────────────────────────────────────
   Numeric stat counter
───────────────────────────────────────────── */
function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1500, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <p
        className="text-5xl font-black text-yellow-400"
        aria-live="polite"
        aria-atomic="true"
      >
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-3 text-slate-300">{label}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Feature card data
───────────────────────────────────────────── */
const features = [
  {
    title: "Learn",
    text: "Master personal finance through practical, easy-to-understand education.",
    icon: (
      /* Graduation cap */
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-12 w-12 text-yellow-400"
        aria-hidden="true"
      >
        <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.948 49.948 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.88 50.88 0 007.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 014.653-2.52.75.75 0 00-.65-1.352 56.123 56.123 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
        <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 01-.46.71 47.87 47.87 0 00-8.105 4.342.75.75 0 01-.832 0 47.87 47.87 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 00.551-1.607 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.667 2.25 2.25 0 002.12 0z" />
        <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
      </svg>
    ),
  },
  {
    title: "Practice",
    text: "Use calculators, worksheets, simulations, and interactive tools to apply what you learn.",
    icon: (
      /* Chart bar */
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-12 w-12 text-blue-400"
        aria-hidden="true"
      >
        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
      </svg>
    ),
  },
  {
    title: "Protect",
    text: "Understand scams, contracts, credit, debt, insurance, taxes, and legal issues before they become expensive mistakes.",
    icon: (
      /* Shield */
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-12 w-12 text-green-400"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: "Grow",
    text: "Build wealth using proven financial principles across every stage of life.",
    icon: (
      /* Trending up / arrow-trending-up */
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-12 w-12 text-blue-400"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M15.22 6.268a.75.75 0 01.968-.431l5.942 2.28a.75.75 0 01.431.97l-2.28 5.941a.75.75 0 11-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 00-5.45 5.173.75.75 0 01-1.199.19L9 12.31l-6.22 6.22a.75.75 0 11-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l3.606 3.605a12.694 12.694 0 015.68-4.973l1.086-.484-4.251-1.631a.75.75 0 01-.432-.968z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
] as const;

/* ─────────────────────────────────────────────
   Trust items
───────────────────────────────────────────── */
const trustItems = [
  {
    label: "Educational",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-yellow-400" aria-hidden="true">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    label: "Practical",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-yellow-400" aria-hidden="true">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "Independent",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-yellow-400" aria-hidden="true">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "Privacy Focused",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-yellow-400" aria-hidden="true">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "Mobile Friendly",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-yellow-400" aria-hidden="true">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "AI Enhanced",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-yellow-400" aria-hidden="true">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
      </svg>
    ),
  },
] as const;

const audiences = [
  "A student",
  "A young family",
  "Military",
  "First responder",
  "Business owner",
  "Investor",
  "Preparing for retirement",
] as const;

/* ─────────────────────────────────────────────
   Main section component
───────────────────────────────────────────── */
export default function WhyEdunancial() {
  return (
    <section
      id="why-edunancial"
      aria-labelledby="why-edunancial-heading"
      className="bg-[#111827]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24">

        {/* ── Section Header ── */}
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            Why Edunancial?
          </p>
          <h2
            id="why-edunancial-heading"
            className="mt-6 text-4xl font-black leading-tight md:text-5xl"
          >
            Financial Education That Creates Financial Competence
          </h2>
          <div className="mx-auto mt-10 max-w-4xl space-y-5 text-xl leading-9 text-slate-300">
            <p>Most financial education teaches information.</p>
            <p>
              Edunancial is designed to build understanding, confidence,
              decision-making ability, and real-world financial competence.
            </p>
            <p className="font-bold text-white">
              Our mission is simple: Help people make better financial decisions
              for life.
            </p>
          </div>
        </div>

        {/* ── Four Feature Cards ── */}
        <ul
          className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="How Edunancial works"
        >
          {features.map((feature) => (
            <li
              key={feature.title}
              className="flex flex-col rounded-xl bg-slate-900 p-8 transition-shadow hover:shadow-lg hover:shadow-yellow-400/10 focus-within:ring-2 focus-within:ring-yellow-400"
            >
              {feature.icon}
              <h3 className="mt-6 text-3xl font-black">{feature.title}</h3>
              <p className="mt-4 flex-1 leading-7 text-slate-300">{feature.text}</p>
            </li>
          ))}
        </ul>

        {/* ── Value Proposition ── */}
        <div className="mt-24 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0d1730] p-10 text-center md:p-14">
          <h2 className="text-3xl font-black leading-tight md:text-4xl">
            One Membership.{" "}
            <span className="text-yellow-400">A Lifetime of Financial Knowledge.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-xl text-slate-300">
            Whether you&rsquo;re:
          </p>
          <ul
            className="mx-auto mt-6 max-w-xs space-y-3 text-left text-lg text-slate-300"
            aria-label="Audiences served by Edunancial"
          >
            {audiences.map((audience) => (
              <li key={audience} className="flex items-center gap-3">
                <span className="text-yellow-400" aria-hidden="true">✓</span>
                {audience}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-2xl font-black text-yellow-400 md:text-3xl">
            Edunancial grows with you.
          </p>
        </div>

        {/* ── Statistics ── */}
        <div className="mt-24">
          <p className="text-center text-xl text-slate-300">
            People struggle with financial literacy.{" "}
            <span className="font-bold text-white">
              Edunancial exists to change that.
            </span>
          </p>
          <div
            className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
            role="region"
            aria-label="Edunancial platform statistics"
          >
            <StatCounter value={500} suffix="+" label="Financial Topics Covered" />
            <StatCounter value={1000} suffix="+" label="Interactive Resources" />
            <StatCounter value={100} suffix="+" label="Courses Being Developed" />
            {/* "Millions" goal – non-numeric display */}
            <div className="text-center">
              <p className="text-4xl font-black text-yellow-400 md:text-5xl">
                Millions
              </p>
              <p className="mt-3 text-slate-300">
                Goal: Better Financial Decisions
              </p>
            </div>
          </div>
        </div>

        {/* ── Trust Badges ── */}
        <div className="mt-24">
          <h2 className="sr-only">Platform Trust Attributes</h2>
          <ul
            className="flex flex-wrap justify-center gap-4"
            aria-label="Edunancial trust attributes"
          >
            {trustItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-300"
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Call to Action ── */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-black md:text-4xl">
            Ready to take control of your financial future?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
            Join Edunancial today and begin building financial competence one
            lesson at a time.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <Link
              href="/membership"
              className="rounded-xl bg-yellow-400 px-10 py-5 text-xl font-black text-black hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
            >
              Become a Member
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-white"
            >
              Explore Courses
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
