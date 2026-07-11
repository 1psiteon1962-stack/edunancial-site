import Link from "next/link";

import CourseProgressBar from "@/components/CourseProgressBar";
import MotivationalQuoteRotator from "@/components/dashboard/MotivationalQuoteRotator";
import {
  type AnnouncementItem,
  type ContinueLearningCourse,
  type FinancialToolShortcut,
  type MemberDashboardData,
  getMemberDashboardData,
} from "@/lib/memberDashboard";

interface DashboardPanelProps {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}

function DashboardPanel({ title, eyebrow, children }: DashboardPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20 md:p-8">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function DashboardLoadingState({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} loading`}
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={`${label}-${index}`}
          className="min-h-40 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70"
        />
      ))}
    </div>
  );
}

function DashboardEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-slate-300">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-3 text-sm leading-7">{description}</p>
    </div>
  );
}

function ContinueLearningSection({
  courses,
  isLoading = false,
}: {
  courses: ContinueLearningCourse[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <DashboardLoadingState label="Continue learning" />;
  }

  if (courses.length === 0) {
    return (
      <DashboardEmptyState
        title="No active courses yet"
        description="Start your first course to see personalized resume cards here."
      />
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {courses.map((course) => (
        <article
          key={course.id}
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70"
        >
          <img
            src={course.imageSrc}
            alt={course.imageAlt}
            width={800}
            height={450}
            className="h-44 w-full object-cover"
          />
          <div className="p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              {course.category}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">{course.title}</h3>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-4 text-sm text-slate-300">
                <span>{course.estimatedTimeRemaining}</span>
                <span>{course.progress}% complete</span>
              </div>
              <CourseProgressBar progress={course.progress} />
            </div>
            <Link
              href={course.href}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              Resume Learning
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function RecommendationSection({
  data,
  isLoading = false,
}: {
  data: MemberDashboardData["recommendations"];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <DashboardLoadingState label="Recommended courses" />;
  }

  if (data.length === 0) {
    return (
      <DashboardEmptyState
        title="Recommendations will appear soon"
        description="As you complete more coursework, personalized next-course suggestions will populate here."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[
          "Personal Finance",
          "Credit",
          "Budgeting",
          "Investing",
          "Taxes",
          "Insurance",
          "Real Estate",
          "Entrepreneurship",
        ].map((category) => (
          <span
            key={category}
            className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300"
          >
            {category}
          </span>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {data.map((recommendation) => (
          <article
            key={recommendation.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
              {recommendation.category}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              {recommendation.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {recommendation.description}
            </p>
            <p className="mt-4 rounded-2xl bg-slate-950/80 p-4 text-sm leading-7 text-slate-300">
              {recommendation.reason}
            </p>
            <Link
              href={recommendation.href}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              Explore course
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

function ToolShortcutCard({ tool }: { tool: FinancialToolShortcut }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
            tool.available
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-slate-800 text-slate-300"
          }`}
        >
          {tool.available ? "Available" : "Coming Soon"}
        </span>
      </div>
      <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">{tool.description}</p>
      {tool.available ? (
        <Link
          href={tool.href}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Open tool
        </Link>
      ) : (
        <span className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-400">
          Coming Soon
        </span>
      )}
    </article>
  );
}

function AnnouncementList({
  announcements,
  isLoading = false,
}: {
  announcements: AnnouncementItem[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <DashboardLoadingState label="Announcements" />;
  }

  if (announcements.length === 0) {
    return (
      <DashboardEmptyState
        title="No announcements right now"
        description="New course updates, webinars, and member news will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <article
          key={announcement.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
              {announcement.tag}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-white">{announcement.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {announcement.description}
          </p>
          <Link
            href={announcement.href}
            className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-blue-300 transition hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            {announcement.cta}
          </Link>
        </article>
      ))}
    </div>
  );
}

export default function PersonalizedMemberDashboard() {
  const data = getMemberDashboardData();
  const monthlyGoalProgress = Math.min(
    100,
    Math.round((data.monthlyGoal.completedHours / data.monthlyGoal.targetHours) * 100),
  );
  const tools = [...data.financialTools].sort(
    (left, right) => Number(right.available) - Number(left.available),
  );

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-950/80 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-blue-950/20 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-yellow-400">
            Member Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
            Welcome back, {data.memberName}!
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            Continue building your financial competence today.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {data.overview.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-black text-white">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.supportingText}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10 grid gap-10">
          <DashboardPanel
            eyebrow="Continue learning"
            title="Pick up where you left off"
          >
            <ContinueLearningSection courses={data.continueLearning} />
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Recommendations"
            title="Recommended next courses"
          >
            <RecommendationSection data={data.recommendations} />
          </DashboardPanel>

          <div className="grid gap-10 xl:grid-cols-[1.25fr,0.95fr]">
            <DashboardPanel
              eyebrow="Learning progress"
              title="Your progress at a glance"
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                    Overall completion
                  </p>
                  <p className="mt-3 text-5xl font-black text-white">
                    {data.overallCompletion}%
                  </p>
                  <div className="mt-4">
                    <CourseProgressBar progress={data.overallCompletion} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Your active pathways are more than halfway complete, with strong momentum in budgeting and personal finance.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                    Monthly learning goal
                  </p>
                  <p className="mt-3 text-5xl font-black text-white">
                    {monthlyGoalProgress}%
                  </p>
                  <div className="mt-4">
                    <CourseProgressBar progress={monthlyGoalProgress} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {data.monthlyGoal.completedHours} of {data.monthlyGoal.targetHours} hours completed this month.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr,0.9fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <h3 className="text-lg font-semibold text-white">Category completion</h3>
                  <div className="mt-5 space-y-5">
                    {data.categoryCompletion.map((category) => (
                      <div key={category.category}>
                        <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                          <span>{category.category}</span>
                          <span>
                            {category.lessonsCompleted}/{category.totalLessons} lessons
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex-1">
                            <CourseProgressBar progress={category.completion} />
                          </div>
                          <span className="w-12 text-right text-sm font-semibold text-white">
                            {category.completion}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <h3 className="text-lg font-semibold text-white">Weekly activity</h3>
                  <div className="mt-5 grid grid-cols-7 gap-3">
                    {data.weeklyActivity.map((point) => (
                      <div key={point.day} className="text-center">
                        <div className="flex h-36 items-end justify-center rounded-2xl bg-slate-950/80 p-2">
                          <div
                            className="w-full rounded-xl bg-blue-500"
                            style={{
                              height: `${Math.max(18, Math.round((point.minutes / 60) * 100))}%`,
                            }}
                            aria-label={`${point.day}: ${point.minutes} minutes`}
                            title={`${point.day}: ${point.minutes} minutes`}
                          />
                        </div>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                          {point.day}
                        </p>
                        <p className="mt-1 text-sm text-white">{point.minutes}m</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DashboardPanel>

            <div className="grid gap-10">
              <DashboardPanel
                eyebrow="Achievements"
                title="Badges earned and in progress"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {data.achievementBadges.map((badge) => (
                    <article
                      key={badge.id}
                      className={`rounded-2xl border p-5 ${
                        badge.earned
                          ? "border-emerald-500/40 bg-emerald-500/10"
                          : "border-slate-800 bg-slate-900/70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/80 text-xl text-white">
                          {badge.icon}
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                            badge.earned
                              ? "bg-emerald-500/20 text-emerald-200"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {badge.earned ? "Earned" : "Locked"}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">{badge.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{badge.description}</p>
                      <p className="mt-3 text-sm font-semibold text-blue-200">
                        {badge.progressLabel}
                      </p>
                    </article>
                  ))}
                </div>
              </DashboardPanel>

              <DashboardPanel
                eyebrow="Quick access"
                title="Financial tool shortcuts"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {tools.map((tool) => (
                    <ToolShortcutCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </DashboardPanel>
            </div>
          </div>

          <div className="grid gap-10 xl:grid-cols-[1.15fr,0.85fr]">
            <DashboardPanel eyebrow="Announcements" title="What is new for members">
              <AnnouncementList announcements={data.announcements} />
            </DashboardPanel>

            <div className="grid gap-10">
              <MotivationalQuoteRotator quotes={data.motivationalQuotes} />

              <DashboardPanel eyebrow="Next steps" title="Keep your momentum going">
                <div className="grid gap-4">
                  <Link
                    href="/courses"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                  >
                    Browse all courses
                  </Link>
                  <Link
                    href="/financial-tools"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                  >
                    Open financial tools
                  </Link>
                  <Link
                    href="/webinars"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                  >
                    Reserve a webinar seat
                  </Link>
                </div>
              </DashboardPanel>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
