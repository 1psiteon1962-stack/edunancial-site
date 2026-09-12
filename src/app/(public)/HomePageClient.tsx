"use client";

import Link from "next/link";

const tracks = [
  ["RED", "Real Estate", "Build wealth through property.", "from-red-950 to-red-700", "🏠"],
  ["WHITE", "Paper Assets", "Understand stocks, bonds and more.", "from-slate-600 to-slate-800", "▤"],
  ["BLUE", "Business", "Turn ideas into opportunity.", "from-blue-700 to-blue-500", "🏢"],
  ["GREEN", "Taxes", "Know the rules. Keep more of what you earn.", "from-emerald-800 to-emerald-600", "♟"],
  ["GOLD", "Investing", "Grow and protect your wealth.", "from-amber-700 to-yellow-500", "●"],
  ["PURPLE", "Law", "Understand your rights and reduce risk.", "from-purple-900 to-purple-600", "⚖"],
  ["ORANGE", "Sales & Marketing", "Create demand. Increase opportunity.", "from-orange-700 to-orange-500", "📣"],
  ["BLACK", "Leadership", "Develop the mindset to go further.", "from-slate-950 to-slate-700", "♛"],
] as const;

const goals = [
  ["Start a Business", "Learn what you don't know yet and avoid costly mistakes.", "💻"],
  ["Buy or Invest in Real Estate", "Understand financing, cash flow, taxes and risk.", "🏡"],
  ["Prepare for Retirement", "Plan today for a more secure tomorrow.", "🌅"],
  ["Improve My Finances", "Get control, reduce debt, and build wealth.", "📈"],
  ["Advance My Career", "Gain skills that create opportunity.", "💼"],
  ["Help My Family", "Give your family a stronger financial future.", "👨‍👩‍👧"],
] as const;

export default function HomePageClient() {
  return <main className="min-h-screen bg-white text-slate-950">
    <section className="relative isolate overflow-hidden bg-[#08213a] text-white">
      <img src="/home-human-goals.svg" alt="People building financial confidence" className="absolute inset-0 h-full w-full object-cover object-center opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071b31] via-[#071b31]/90 to-[#071b31]/20" />
      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-20 lg:py-24">
        <div className="max-w-xl">
          <h1 className="text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">You were taught<br/>how to earn money.<br/>Now learn how<br/><span className="text-sky-400">money really works.</span></h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-100 sm:text-lg">Practical, unbiased financial education to help you make better decisions about your future.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link href="/curriculum" className="rounded-md bg-yellow-300 px-7 py-3.5 font-black text-slate-950 shadow-lg">Start Free</Link><Link href="/assessment" className="rounded-md border border-white/70 bg-slate-950/25 px-7 py-3.5 font-bold text-white backdrop-blur">Take the Assessment</Link></div>
          <p className="mt-7 text-[11px] font-bold uppercase tracking-[.13em] text-white/90">Knowledge &nbsp; · &nbsp; Confidence &nbsp; · &nbsp; Opportunity &nbsp; · &nbsp; A brighter tomorrow</p>
        </div>
      </div>
    </section>

    <section className="border-b border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 px-6 py-6 lg:grid-cols-4">
      {[["◎","Real-World Knowledge","Practical lessons for real life."],["◉","Learn at Your Pace","Any device, anywhere."],["◎","Global Perspective","Multiple languages."],["▥","From Literacy to Financial Intelligence","A clear, proven pathway."]].map(([icon,title,body]) => <div key={title} className="flex gap-4 px-4 py-3"><span className="text-3xl text-sky-500">{icon}</span><div><h2 className="font-black">{title}</h2><p className="mt-1 text-sm text-slate-600">{body}</p></div></div>)}
    </div></section>

    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-end justify-between gap-6"><div><h2 className="text-3xl font-black tracking-tight">Eight Subjects. One Complete System.</h2><p className="mt-2 text-slate-600">Explore the curriculum and build the knowledge to create a stronger financial future.</p></div><Link href="/curriculum" className="hidden font-bold text-sky-600 md:block">View All Courses →</Link></div>
      <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">{tracks.map(([code,title,body,gradient,icon]) => <Link href={`/curriculum/${code.toLowerCase()}`} key={code} className={`group min-h-44 overflow-hidden rounded-lg bg-gradient-to-b ${gradient} p-4 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}><div className="text-3xl">{icon}</div><h3 className="mt-8 text-lg font-black leading-tight">{title}</h3><p className="mt-2 text-xs leading-5 text-white/90">{body}</p></Link>)}</div>
    </section>

    <section className="bg-gradient-to-b from-sky-50 to-white"><div className="mx-auto max-w-7xl px-6 py-12">
      <div className="text-center"><h2 className="text-3xl font-black tracking-tight sm:text-4xl">What are you trying to accomplish?</h2><p className="mt-2 text-slate-600">Choose a goal below and we'll recommend where to start.</p></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{goals.map(([title,body,icon]) => <Link href="/assessment" key={title} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md"><div className="flex h-28 items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 text-6xl">{icon}</div><div className="p-4"><div className="flex items-start justify-between gap-4"><h3 className="font-black">{title}</h3><span className="text-xl transition group-hover:translate-x-1">→</span></div><p className="mt-1 text-sm leading-5 text-slate-600">{body}</p></div></Link>)}</div>
      <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg bg-sky-100 px-7 py-5 sm:flex-row"><div><h3 className="text-lg font-black">Not sure where to start?</h3><p className="text-sm text-slate-600">Take a short assessment and we'll create a personalized learning path for you.</p></div><Link href="/assessment" className="shrink-0 rounded-md bg-blue-600 px-7 py-3 font-bold text-white">Take the Assessment</Link></div>
    </div></section>
  </main>;
}
