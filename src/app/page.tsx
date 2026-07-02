import Link from "next/link";
import HomePortal from "@/components/home/HomePortal";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-b from-[#08101f] via-[#0d1730] to-[#08101f]">

        <div className="mx-auto max-w-7xl px-6 py-28 text-center">

          <p className="uppercase tracking-[0.5em] text-yellow-400 font-bold">

            EDUNANCIAL

          </p>

          <h1 className="mt-10 text-7xl md:text-8xl font-black leading-none">

            BUILD

            <br/>

            <span className="text-blue-500">

              FINANCIAL

            </span>

            <span className="block text-white">

              COMPETENCY

            </span>

          </h1>

          <p className="mx-auto mt-12 max-w-5xl text-3xl leading-relaxed text-slate-300">

            Financial literacy provides the foundation.

            <br/>

            Financial competency is built through disciplined action.

          </p>

          <p className="mx-auto mt-10 max-w-5xl text-xl leading-9 text-slate-400">

            Edunancial is the launch pad that helps people take that first step—

            from understanding financial concepts to developing real-world

            financial competency.

          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-6">

            <Link
              href="/assessment"
              className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
            >

              Take Assessment

            </Link>

            <Link
              href="/courses"
              className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
            >

              Start Learning

            </Link>

          </div>

        </div>

      </section>

      {/* JOURNEY */}

      <section className="bg-slate-900 py-24">

        <div className="mx-auto max-w-6xl">

          <h2 className="text-center text-5xl font-black">

            Your Journey

          </h2>

          <div className="mt-16 space-y-10 text-center">

            <div className="text-3xl font-bold">

              Financial Literacy

            </div>

            <div className="text-5xl text-blue-500">

              ↓

            </div>

            <div className="text-3xl font-bold">

              Financial Competency

            </div>

            <div className="text-5xl text-blue-500">

              ↓

            </div>

            <div className="text-3xl font-bold">

              Economic Competency

            </div>

            <div className="text-5xl text-blue-500">

              ↓

            </div>

            <div className="text-3xl font-bold">

              Business Ownership

            </div>

            <div className="text-5xl text-blue-500">

              ↓

            </div>

            <div className="text-3xl font-bold">

              Wealth Creation

            </div>

          </div>

        </div>

      </section>

      {/* RED WHITE BLUE */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h2 className="text-center text-5xl font-black">

          Choose Your Path

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          <div className="rounded-xl bg-red-700 p-10">

            <h3 className="text-5xl font-black">

              RED

            </h3>

            <p className="mt-8 text-xl">

              Learn Real Estate

            </p>

            <p className="mt-6 text-red-100">

              Build Real Estate Competency

            </p>

          </div>

          <div className="rounded-xl bg-slate-100 p-10 text-slate-900">

            <h3 className="text-5xl font-black">

              WHITE

            </h3>

            <p className="mt-8 text-xl">

              Learn Investing

            </p>

            <p className="mt-6">

              Build Financial Competency

            </p>

          </div>

          <div className="rounded-xl bg-blue-700 p-10">

            <h3 className="text-5xl font-black">

              BLUE

            </h3>

            <p className="mt-8 text-xl">

              Learn Business

            </p>

            <p className="mt-6 text-blue-100">

              Build Entrepreneurial Competency

            </p>

          </div>

        </div>

      </section>
