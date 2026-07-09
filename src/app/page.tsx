import Link from "next/link";
import type { Metadata } from "next";
import HomePortal from "@/components/home/HomePortal";

import HomeMembershipSection from "@/components/membership/HomeMembershipSection";
import FreeDownloadsSection from "@/components/membership/FreeDownloadsSection";
import MemberWelcomeKit from "@/components/membership/MemberWelcomeKit";
import WhyMembershipMatters from "@/components/membership/WhyMembershipMatters";
import MembershipCallToAction from "@/components/membership/MembershipCallToAction";

import FeaturedCourses from "@/components/home/FeaturedCourses";
import SuccessStories from "@/components/home/SuccessStories";
import MarketplacePreview from "@/components/home/MarketplacePreview";
import AICoachPreview from "@/components/home/AICoachPreview";
import CompetencyJourney from "@/components/home/CompetencyJourney";
import FrequentlyAskedQuestions from "@/components/home/FrequentlyAskedQuestions";
import CommunitySection from "@/components/home/CommunitySection";
import FinalCallToAction from "@/components/home/FinalCallToAction";
import WhyEdunancial from "@/components/home/WhyEdunancial";

export const metadata: Metadata = {
  title: "Edunancial | Financial Literacy & Financial Competency",
  description:
    "Edunancial helps individuals, families, entrepreneurs, and business owners build financial competency through real estate, paper assets, and business education. North America's financial education platform.",
  alternates: {
    canonical: "https://www.edunancial.com",
  },
  openGraph: {
    title: "Edunancial | Financial Literacy & Financial Competency",
    description:
      "Build real financial competency — not just literacy. Master real estate, paper assets, and business. Serving North America.",
    url: "https://www.edunancial.com",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#08101f] via-[#0d1730] to-[#08101f]">
        <div className="mx-auto max-w-7xl px-6 py-28 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            North America&rsquo;s Financial Competency Platform
          </p>

          <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
            Stop Being Financially Literate.
            <br />
            <span className="text-blue-400">Start Being Financially Competent.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-gray-300">
            Edunancial teaches individuals, families, entrepreneurs, and business owners how to
            build wealth across three asset classes:{" "}
            <span className="font-bold text-red-400">Real Estate</span>,{" "}
            <span className="font-bold text-white">Paper Assets</span>, and{" "}
            <span className="font-bold text-blue-400">Business</span>.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Financial literacy provides the foundation.{" "}
            <span className="font-bold text-white">
              Financial competency is built through disciplined action.
            </span>
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/membership"
              className="rounded-xl bg-yellow-400 px-10 py-5 text-xl font-black text-black hover:bg-yellow-300"
            >
              Become a Member
            </Link>
            <Link
              href="/assessment"
              className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
            >
              Take Free Assessment
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
            >
              Explore Courses
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mx-auto mt-14 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
            <span>✓ No financial advice — education only</span>
            <span>✓ Privacy protected — we never sell your data</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Serving US &amp; Canada</span>
          </div>

        </div>
      </section>

      {/* WHY EDUNANCIAL — Trust & Credibility */}
      <WhyEdunancial />

      {/* THREE PILLARS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-5xl font-black">
          Three Asset Classes.
          <br />
          One System.
        </h2>
        <p className="mx-auto mt-8 max-w-5xl text-center text-xl leading-9 text-slate-300">
          Every lesson inside Edunancial fits into one of three wealth-building categories.
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-red-700 p-10">
            <h3 className="text-4xl font-black">RED</h3>
            <p className="mt-4 text-xl font-bold">Real Estate</p>
            <p className="mt-4 text-slate-100">
              Residential &bull; Commercial &bull; Tax Liens &bull; Tax Deeds &bull;
              Creative Financing &bull; 1031 Exchanges
            </p>
            <Link href="/courses/red" className="mt-6 inline-block text-sm font-bold underline">
              Explore Real Estate &rarr;
            </Link>
          </div>
          <div className="rounded-xl bg-white p-10 text-slate-900">
            <h3 className="text-4xl font-black">WHITE</h3>
            <p className="mt-4 text-xl font-bold">Paper Assets</p>
            <p className="mt-4">
              Budgeting &bull; Credit &bull; Stocks &bull; ETFs &bull; Options &bull;
              Retirement &bull; Precious Metals
            </p>
            <Link href="/courses/white" className="mt-6 inline-block text-sm font-bold underline">
              Explore Paper Assets &rarr;
            </Link>
          </div>
          <div className="rounded-xl bg-blue-700 p-10">
            <h3 className="text-4xl font-black">BLUE</h3>
            <p className="mt-4 text-xl font-bold">Business</p>
            <p className="mt-4">
              Entrepreneurship &bull; Marketing &bull; KPIs &bull; Pricing &bull;
              Cash Flow &bull; Profit &bull; Scaling
            </p>
            <Link href="/courses/blue" className="mt-6 inline-block text-sm font-bold underline">
              Explore Business &rarr;
            </Link>
          </div>
        </div>
      </section>

      <HomeMembershipSection />
      <FreeDownloadsSection />
      <MemberWelcomeKit />
      <WhyMembershipMatters />
      <MembershipCallToAction />

      {/* WHY EDUNANCIAL */}
      <section className="bg-[#111827]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">OUR STORY</p>
          <h2 className="mt-6 text-5xl font-black">Why Edunancial Exists</h2>
          <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
            Edunancial didn&rsquo;t begin as a business plan.
            It began as a conversation between a father and his eleven-year-old son.
          </p>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
            One day, my son came into my room.
            I had just finished sending a file to a client and was waiting for an electronic payment to arrive.
            A few moments later, the payment came through.
          </p>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
            My son looked at the amount on my phone and asked,
          </p>
          <blockquote className="mt-8 border-l-4 border-yellow-400 pl-8 text-4xl font-black italic">
            &ldquo;Dad... how did you do that?&rdquo;
          </blockquote>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">I answered,</p>
          <blockquote className="mt-8 border-l-4 border-blue-500 pl-8 text-4xl font-black italic">
            &ldquo;Because I worked with my head.&rdquo;
          </blockquote>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
            Then I asked him a question that would change both of our lives.
          </p>
          <blockquote className="mt-8 border-l-4 border-green-500 pl-8 text-4xl font-black italic">
            &ldquo;Would you like to work with your head someday?&rdquo;
          </blockquote>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">He smiled and answered,</p>
          <blockquote className="mt-8 border-l-4 border-red-500 pl-8 text-4xl font-black italic">
            &ldquo;Yes... but I don&rsquo;t know how.&rdquo;
          </blockquote>
          <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">That answer stopped me.</p>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
            At that moment, I realized something.
            Schools teach people how to earn a paycheck, but they rarely teach people how to build wealth,
            evaluate investments, understand business, or create financial freedom.
          </p>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
            If my own son didn&rsquo;t know how, millions of other children—and adults—probably didn&rsquo;t either.
          </p>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
            So we began learning together at the kitchen table.
            We talked about saving before spending, investing before consuming, profit before revenue,
            and making decisions based on knowledge instead of emotion.
            We explored real estate, businesses, stocks, options, precious metals,
            and the principles that create lasting wealth.
          </p>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
            But learning wasn&rsquo;t enough. I wanted him to apply what he was learning.
          </p>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
            He began using his own money to purchase silver.
            As his knowledge and confidence grew, he eventually began buying gold as well.
            He wasn&rsquo;t just learning financial literacy anymore.
            He was applying it. He was developing financial competency by making informed
            financial decisions with his own money.
          </p>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
            Those same principles were later shared with entrepreneurs in another country.
            Different people. Different cultures. The same financial principles.
          </p>
          <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
            Today, Edunancial exists to help individuals, families, entrepreneurs, and business owners
            build something far more valuable than financial literacy alone.
          </p>
          <blockquote className="mt-12 border-l-4 border-yellow-400 pl-8 text-4xl font-black leading-relaxed">
            Financial literacy provides the foundation.
            <br />
            Financial competency creates choices.
            <br />
            Financial competency creates independence.
            <br />
            Financial competency builds wealth.
          </blockquote>
          <p className="mt-12 max-w-5xl text-3xl font-bold leading-relaxed">
            And it all began with one eleven-year-old boy asking a simple question...
          </p>
          <blockquote className="mt-8 border-l-4 border-white pl-8 text-5xl font-black italic">
            &ldquo;Dad... how did you do that?&rdquo;
          </blockquote>
        </div>
      </section>

      {/* FINANCIAL COMPETENCY */}
      <section className="bg-[#111827]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">FINANCIAL COMPETENCY</p>
          <h2 className="mt-6 text-center text-5xl font-black">Financial Competency</h2>
          <p className="mx-auto mt-10 max-w-5xl text-center text-xl leading-9 text-slate-300">
            Financial literacy introduces ideas.
            Financial competency develops the judgment, discipline,
            habits, and decision-making skills necessary to apply those ideas successfully over a lifetime.
          </p>
          <p className="mx-auto mt-8 max-w-5xl text-center text-lg leading-9 text-slate-400">
            Knowledge without action creates very little.
            Action without knowledge creates unnecessary risk.
            Financial competency combines both.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black">Learn</h3>
              <p className="mt-6 text-slate-300">Understand principles before making financial decisions.</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black">Practice</h3>
              <p className="mt-6 text-slate-300">Apply what you learn in real-world situations.</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black">Measure</h3>
              <p className="mt-6 text-slate-300">Track progress through measurable financial competency.</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black">Improve</h3>
              <p className="mt-6 text-slate-300">Continue improving throughout your lifetime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ENTREPRENEUR ASSESSMENT */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">START HERE</p>
          <h2 className="mt-6 text-5xl font-black">Measure Your Financial Competency</h2>
          <p className="mt-8 max-w-5xl text-xl leading-9 text-slate-300">
            Every successful journey begins by knowing where you are today.
            Our Financial Competency Assessment measures your current knowledge,
            identifies strengths, uncovers opportunities for improvement,
            and builds a personalized roadmap designed specifically for you.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black">Financial</h3>
              <p className="mt-6 text-slate-300">Budgeting<br />Credit<br />Debt<br />Cash Flow</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black">Investing</h3>
              <p className="mt-6 text-slate-300">Stocks<br />ETFs<br />Precious Metals<br />Retirement</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black">Business</h3>
              <p className="mt-6 text-slate-300">KPIs<br />Profit<br />Cash Flow<br />Leadership</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-8">
              <h3 className="text-3xl font-black">Personalized</h3>
              <p className="mt-6 text-slate-300">
                Competency Score<br />Learning Roadmap<br />Course Recommendations<br />Progress Tracking
              </p>
            </div>
          </div>
          <div className="mt-16 flex flex-wrap gap-6">
            <Link
              href="/assessment"
              className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
            >
              Begin Free Assessment
            </Link>
            <Link
              href="/business"
              className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
            >
              Business Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* ECONOMIC SELF DEFENSE */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-5xl font-black">Economic Self Defense</h2>
          <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
            Learn. Earn. Save. Invest. Build Wealth.
          </p>
          <p className="mt-8 max-w-5xl text-xl leading-9 text-slate-400">
            Our mission is to help individuals, families, entrepreneurs, and businesses
            make better financial decisions regardless of where they live.
          </p>
        </div>
      </section>

      {/* MARKETPLACE */}
      <section className="bg-[#111827]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">MARKETPLACE</p>
          <h2 className="mt-6 text-5xl font-black">
            Learn.<br />Connect.<br />Apply.
          </h2>
          <p className="mt-10 max-w-5xl text-xl leading-9 text-slate-300">
            Education is only the beginning.
            Connect with professionals who can help you implement what you&rsquo;ve learned.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            <div className="rounded-xl bg-slate-900 p-8"><h3 className="text-2xl font-black">Attorneys</h3></div>
            <div className="rounded-xl bg-slate-900 p-8"><h3 className="text-2xl font-black">Accountants</h3></div>
            <div className="rounded-xl bg-slate-900 p-8"><h3 className="text-2xl font-black">Lenders</h3></div>
            <div className="rounded-xl bg-slate-900 p-8"><h3 className="text-2xl font-black">Business Advisors</h3></div>
          </div>
        </div>
      </section>

      {/* FAMILY LEARNING */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-5xl font-black">Family Learning</h2>
          <p className="mt-10 max-w-5xl text-xl leading-9 text-slate-300">
            Financial competency should become a family tradition.
            Parents. Children. Grandparents. Learning together.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-slate-900 p-10"><h3 className="text-3xl font-black">Children</h3></div>
            <div className="rounded-xl bg-slate-900 p-10"><h3 className="text-3xl font-black">Teen Entrepreneurs</h3></div>
            <div className="rounded-xl bg-slate-900 p-10"><h3 className="text-3xl font-black">Family Missions</h3></div>
          </div>
        </div>
      </section>

      {/* EXECUTIVE LEARNING */}
      <section className="bg-[#111827]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="text-5xl font-black">Executive Learning</h2>
          <p className="mt-10 max-w-5xl text-xl leading-9 text-slate-300">
            Advanced education for executives, entrepreneurs, investors, managers, and business owners.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            <div className="rounded-xl bg-slate-900 p-8">Executive KPIs</div>
            <div className="rounded-xl bg-slate-900 p-8">AI Coaching</div>
            <div className="rounded-xl bg-slate-900 p-8">Dashboards</div>
            <div className="rounded-xl bg-slate-900 p-8">Global Expansion</div>
          </div>
        </div>
      </section>

      {/* HOME PORTAL */}
      <HomePortal />

      {/* TRUST & PRIVACY STRIP */}
      <section className="bg-[#0a1628] border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-center text-3xl font-black mb-2">
            Your Privacy &amp; Security Are Built In
          </h2>
          <p className="text-center text-slate-400 mb-12">
            Edunancial is designed with privacy and security from the ground up &mdash; not as an afterthought.
          </p>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-xl bg-slate-900 p-6 text-center">
              <div className="text-3xl mb-3">&#128274;</div>
              <h3 className="font-bold">Data Privacy</h3>
              <p className="mt-2 text-sm text-slate-400">We never sell your personal information. Your data is yours.</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-6 text-center">
              <div className="text-3xl mb-3">&#127482;&#127480; &#127464;&#127462;</div>
              <h3 className="font-bold">US &amp; Canada Compliance</h3>
              <p className="mt-2 text-sm text-slate-400">Built for CCPA, Canadian PIPEDA, and Quebec Law 25 requirements.</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-6 text-center">
              <div className="text-3xl mb-3">&#9989;</div>
              <h3 className="font-bold">Consent-First</h3>
              <p className="mt-2 text-sm text-slate-400">You control your data and communication preferences at all times.</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-6 text-center">
              <div className="text-3xl mb-3">&#128203;</div>
              <h3 className="font-bold">Transparent Policies</h3>
              <p className="mt-2 text-sm text-slate-400">
                Clear policies you can actually understand.{" "}
                <Link href="/privacy" className="underline text-blue-400">Read our Privacy Policy</Link>.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/trust-center" className="text-blue-400 underline text-sm">
              Visit our Trust Center &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP CTA */}
      <section className="bg-gradient-to-r from-blue-900 via-[#0d1730] to-blue-900">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400 mb-4">
            BECOME A MEMBER
          </p>
          <h2 className="text-5xl font-black">
            Ready to Build Financial Competency?
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-xl leading-9 text-slate-300">
            Join Edunancial today and get access to courses, assessments, the financial passport,
            AI coaching, and a community of learners committed to building real wealth.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Link
              href="/membership"
              className="rounded-xl bg-yellow-400 px-12 py-5 text-xl font-black text-black hover:bg-yellow-300"
            >
              View Membership Plans
            </Link>
            <Link
              href="/assessment"
              className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
            >
              Start Free Assessment
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
            >
              Browse Courses
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            Educational content only &mdash; not financial advice. See our{" "}
            <Link href="/disclaimer" className="underline">disclaimer</Link>.
          </p>
        </div>
      </section>

    </main>
  );
}
