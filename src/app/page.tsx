import Link from "next/link";
import HomePortal from "@/components/home/HomePortal";

export const metadata = {
  title: "Edunancial | Financial Literacy & Financial Competency",
  description:
    "Financial literacy provides the foundation. Financial competency is built through disciplined action.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-b from-[#08101f] via-[#0d1730] to-[#08101f]">

        <div className="mx-auto max-w-7xl px-6 py-28 text-center">

          <p className="text-lg font-bold uppercase tracking-[0.45em] text-yellow-400">
            EDUNANCIAL
          </p>

          <h1 className="mt-10 text-7xl font-black leading-none md:text-8xl">

            <span className="block text-red-500">
              RED.
            </span>

            <span className="block text-white">
              WHITE.
            </span>

            <span className="block text-blue-500">
              BLUE.
            </span>

          </h1>

          <div className="mx-auto mt-10 h-2 w-full max-w-5xl rounded-full bg-gradient-to-r from-red-600 via-white to-blue-600" />

          <p className="mx-auto mt-12 max-w-5xl text-3xl leading-relaxed text-gray-300">
            Real Estate. Paper Assets. Business.
          </p>

          <p className="mx-auto mt-6 max-w-5xl text-2xl leading-relaxed text-gray-400">
            Financial literacy provides the foundation.
            <br />
            <span className="font-bold text-white">
              Financial competency is built through disciplined action.
            </span>
          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-6">

            <Link
              href="/assessment"
              className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
            >
              Start Assessment
            </Link>

            <Link
              href="/courses"
              className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
            >
              Explore Courses
            </Link>

          </div>

        </div>

      </section>

      {/* THREE PILLARS */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h2 className="text-center text-6xl font-black">

          Three Asset Classes.
          <br />
          One System.

        </h2>

        <p className="mx-auto mt-8 max-w-5xl text-center text-2xl leading-10 text-slate-300">

          Every lesson inside Edunancial fits into one of three
          wealth-building categories.

        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          <div className="rounded-xl bg-red-700 p-10">

            <h3 className="text-4xl font-black">

              RED

            </h3>

            <p className="mt-8 text-xl">

              Real Estate

            </p>

            <p className="mt-6 text-slate-100">

              Residential • Commercial • Tax Liens • Tax Deeds •
              Creative Financing • 1031 Exchanges

            </p>

          </div>

          <div className="rounded-xl bg-white p-10 text-slate-900">

            <h3 className="text-4xl font-black">

              WHITE

            </h3>

            <p className="mt-8 text-xl">

              Paper Assets

            </p>

            <p className="mt-6">

              Budgeting • Credit • Stocks • ETFs • Options •
              Retirement • Precious Metals

            </p>

          </div>

          <div className="rounded-xl bg-blue-700 p-10">

            <h3 className="text-4xl font-black">

              BLUE

            </h3>

            <p className="mt-8 text-xl">

              Business

            </p>

            <p className="mt-6">

              Entrepreneurship • Marketing • KPIs • Pricing •
              Cash Flow • Profit • Scaling

            </p>

          </div>

        </div>

      </section>

      {/* FINANCIAL COMPETENCY */}

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <h2 className="text-center text-6xl font-black">

            Financial Competency

          </h2>

          <p className="mx-auto mt-10 max-w-5xl text-center text-2xl leading-10 text-slate-300">

            Knowledge alone is not enough.

            Real competency comes from learning,
            practicing,
            measuring,
            and improving over time.

          </p>

          <div className="mt-20 grid gap-8 md:grid-cols-4">

            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-2xl font-black">Learn</h3>
            </div>

            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-2xl font-black">Practice</h3>
            </div>

            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-2xl font-black">Measure</h3>
            </div>

            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-2xl font-black">Improve</h3>
            </div>

          </div>

        </div>

      </section> 
            {/* ENTREPRENEUR ASSESSMENT */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-6">

          <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
            START HERE
          </p>

          <h2 className="mt-6 text-6xl font-black">
            Measure Your Financial Competency
          </h2>

          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

            Don't guess where to begin.

            Discover your strengths,
            identify your weaknesses,
            and receive a personalized learning roadmap.

          </p>

          <div className="mt-20 grid gap-8 md:grid-cols-4">

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-3xl font-black">

                Financial

              </h3>

              <p className="mt-6 text-slate-300">

                Budgeting

                <br/>

                Credit

                <br/>

                Debt

              </p>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-3xl font-black">

                Investing

              </h3>

              <p className="mt-6 text-slate-300">

                Stocks

                <br/>

                ETFs

                <br/>

                Precious Metals

              </p>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-3xl font-black">

                Business

              </h3>

              <p className="mt-6 text-slate-300">

                Profit

                <br/>

                Cash Flow

                <br/>

                KPIs

              </p>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-3xl font-black">

                Overall

              </h3>

              <p className="mt-6 text-slate-300">

                Personalized Learning Plan

              </p>

            </div>

          </div>

          <div className="mt-16">

            <Link
              href="/assessment"
              className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
            >

              Begin Assessment

            </Link>

          </div>

        </div>

      </section>

      {/* WHY EDUNANCIAL */}

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <h2 className="text-6xl font-black">

            Why Edunancial?

          </h2>

          <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

            Edunancial began with a father teaching his
            eleven-year-old son principles of investing,
            entrepreneurship,
            and wealth creation.

          </p>

          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

            Years later,
            those same principles were used to help develop
            entrepreneurs in another country.

            Different people.

            Different cultures.

            The same financial principles.

          </p>

          <div className="mt-14">

            <Link
              href="/why-edunancial"
              className="rounded-xl bg-green-600 px-8 py-5 text-xl font-bold"
            >

              Read Our Story

            </Link>

          </div>

        </div>

      </section>

      {/* ECONOMIC SELF DEFENSE */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-6xl font-black">

            Economic Self Defense

          </h2>

          <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

            Learn.

            Earn.

            Save.

            Invest.

            Build Wealth.

          </p>

          <p className="mt-8 max-w-5xl text-xl leading-9 text-slate-400">

            Our mission is to help individuals,
            families,
            entrepreneurs,
            and businesses make better financial decisions
            regardless of where they live.

          </p>

        </div>

      </section>
            {/* MARKETPLACE */}

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
            MARKETPLACE
          </p>

          <h2 className="mt-6 text-6xl font-black">

            Learn.
            <br />
            Connect.
            <br />
            Apply.

          </h2>

          <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

            Education is only the beginning.

            Connect with professionals who can help you
            implement what you've learned.

          </p>

          <div className="mt-20 grid gap-8 md:grid-cols-4">

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Attorneys

              </h3>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Accountants

              </h3>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Lenders

              </h3>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Business Advisors

              </h3>

            </div>

          </div>

        </div>

      </section>

      {/* FAMILY LEARNING */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-6xl font-black">

            Family Learning

          </h2>

          <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

            Financial competency should become a family tradition.

            Parents.

            Children.

            Grandparents.

            Learning together.

          </p>

          <div className="mt-20 grid gap-8 md:grid-cols-3">

            <div className="rounded-xl bg-slate-900 p-10">

              <h3 className="text-3xl font-black">

                Children

              </h3>

            </div>

            <div className="rounded-xl bg-slate-900 p-10">

              <h3 className="text-3xl font-black">

                Teen Entrepreneurs

              </h3>

            </div>

            <div className="rounded-xl bg-slate-900 p-10">

              <h3 className="text-3xl font-black">

                Family Missions

              </h3>

            </div>

          </div>

        </div>

      </section>

      {/* EXECUTIVE LEARNING */}

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <h2 className="text-6xl font-black">

            Executive Learning

          </h2>

          <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

            Advanced education for executives,
            entrepreneurs,
            investors,
            managers,
            and business owners.

          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-4">

            <div className="rounded-xl bg-slate-900 p-8">

              Executive KPIs

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              AI Coaching

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              Dashboards

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              Global Expansion

            </div>

          </div>

        </div>

      </section>

      {/* HOME PORTAL */}

      <HomePortal />

      {/* FOOTER CTA */}

      <section className="bg-[#0b1326]">

        <div className="mx-auto max-w-7xl px-6 py-24 text-center">

          <h2 className="text-6xl font-black">

            Ready to Build
            <br />
            Financial Competency?

          </h2>

          <p className="mx-auto mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

            Start your journey today.

            Learn.

            Practice.

            Measure.

            Improve.

          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-6">

            <Link
              href="/assessment"
              className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
            >

              Start Assessment

            </Link>

            <Link
              href="/courses"
              className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
            >

              Browse Courses

            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
