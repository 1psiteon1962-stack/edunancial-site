// components/sections/CoursesSection.tsx
const courseCategories = [
  {
    id: "real-estate",
    title: "Real Estate Foundations",
    colorClass: "border-red-500/60 bg-red-50",
    tag: "Red Track",
    description:
      "Tax liens, tax deeds, flips, and creative strategies explained in clear steps.",
    image: "/img/courses/real-estate-diverse.jpg", // replace with real image later
  },
  {
    id: "paper-assets",
    title: "Paper Assets & Options",
    colorClass: "border-slate-300 bg-slate-50",
    tag: "White Track",
    description:
      "Stocks, options, and compounding for new investors who want rules, not hype.",
    image: "/img/courses/paper-assets-diverse.jpg",
  },
  {
    id: "business-growth",
    title: "Business Is About Making Profit",
    colorClass: "border-blue-500/60 bg-blue-50",
    tag: "Blue Track",
    description:
      "From structure and pricing to KPIs and scaling, learn how real businesses grow.",
    image: "/img/courses/business-diverse.jpg",
  },
];

export default function CoursesSection() {
  return (
    <section className="bg-white py-16" id="courses">
      <div className="mx-auto max-w-6xl px-6">
        {/* Top banner with diverse imagery placeholder */}
        <div className="mb-10 grid gap-6 md:grid-cols-3 md:items-center">
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Courses
            </h2>
            <h3 className="text-3xl font-bold text-slate-900">
              Learn in tracks that match your path.
            </h3>
            <p className="text-sm text-slate-700">
              Edunancial organizes learning in three tracks — Real Estate
              (Red), Paper Assets (White), and Business (Blue). Every course is
              designed to be clear enough for beginners and strong enough to
              grow with you.
            </p>
          </div>
          <div className="h-40 overflow-hidden rounded-2xl bg-slate-200 shadow-md md:h-44">
            {/* This should be replaced with a real diverse group photo */}
            <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-600">
              Diverse learners preview image
            </div>
          </div>
        </div>

        {/* Category cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {courseCategories.map((cat) => (
            <div
              key={cat.id}
              className={`flex flex-col overflow-hidden rounded-2xl border ${cat.colorClass} shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="h-32 bg-slate-200">
                {/* Replace with real <Image /> later */}
                <div className="flex h-full items-center justify-center text-[11px] font-semibold text-slate-600">
                  Image: {cat.title}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="mb-1 inline-flex w-fit rounded-full bg-slate-900/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                  {cat.tag}
                </span>
                <h4 className="mb-1 text-lg font-bold text-slate-900">
                  {cat.title}
                </h4>
                <p className="mb-3 text-sm text-slate-700">
                  {cat.description}
                </p>
                <p className="mt-auto text-xs font-semibold text-blue-700">
                  Full course details available inside the portal.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
