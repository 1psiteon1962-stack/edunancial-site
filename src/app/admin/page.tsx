import Link from "next/link";

const sections = [
  {
    title: "Executive",
    description: "High-level KPIs, global performance and executive reporting.",
    color: "border-yellow-500",
    badge: "bg-yellow-500/10 text-yellow-400",
    modules: [
      { title: "Command Center", href: "/admin/executive-command-center", desc: "Global command overview" },
      { title: "Global Dashboard", href: "/admin/global-dashboard", desc: "Revenue, profit and growth" },
      { title: "Executive Summary", href: "/admin/executive-summary", desc: "Key metrics snapshot" },
      { title: "Executive Marketing", href: "/admin/executive-marketing", desc: "Marketing performance overview" },
      { title: "Profit Dashboard", href: "/admin/profit-dashboard", desc: "Margin and profitability" },
      { title: "KPI Dashboard", href: "/admin/kpi", desc: "All tracked KPIs" },
      { title: "Executive Dashboard", href: "/admin/dashboard", desc: "Core business metrics" },
    ],
  },
  {
    title: "Content",
    description: "Manage all educational content, media and downloadable assets.",
    color: "border-blue-500",
    badge: "bg-blue-500/10 text-blue-400",
    modules: [
      { title: "Books", href: "/admin/books", desc: "Book inventory and uploads" },
      { title: "Courses", href: "/admin/courses", desc: "Lessons, quizzes and paths" },
      { title: "Financial Terms", href: "/admin/terms", desc: "Red, White and Blue packs" },
      { title: "Video Lessons", href: "/admin/video-lessons", desc: "YouTube and hosted lessons" },
      { title: "Audio Books", href: "/admin/audiobooks", desc: "Audio editions manager" },
      { title: "Quizzes", href: "/admin/quizzes", desc: "Assessment builder" },
      { title: "Certificates", href: "/admin/certificates", desc: "Certificate generator" },
      { title: "Webinars", href: "/admin/webinars", desc: "Live event scheduler" },
      { title: "Videos", href: "/admin/videos", desc: "Video course library" },
      { title: "PDF Library", href: "/admin/pdf-library", desc: "Uploaded PDF catalog" },
      { title: "EPUB Manager", href: "/admin/epub", desc: "EPUB file management" },
      { title: "Book Covers", href: "/admin/covers", desc: "Cover image uploads" },
      { title: "Upload Manager", href: "/admin/uploads", desc: "Bulk file uploads" },
    ],
  },
  {
    title: "Commerce",
    description: "Customers, memberships, pricing and subscription management.",
    color: "border-green-500",
    badge: "bg-green-500/10 text-green-400",
    modules: [
      { title: "Customers", href: "/admin/customers", desc: "Customer database" },
      { title: "Memberships", href: "/admin/memberships", desc: "Plan and access control" },
      { title: "Pricing", href: "/admin/pricing", desc: "Regional pricing matrix" },
      { title: "Subscribers", href: "/admin/subscribers", desc: "Active subscribers list" },
      { title: "Provider Management", href: "/admin/provider-management", desc: "Professional marketplace" },
    ],
  },
  {
    title: "Marketing",
    description: "Campaigns, email lists, lead generation and growth analytics.",
    color: "border-purple-500",
    badge: "bg-purple-500/10 text-purple-400",
    modules: [
      { title: "Marketing Dashboard", href: "/admin/marketing-dashboard", desc: "Marketing overview" },
      { title: "Marketing KPIs", href: "/admin/marketing-kpis", desc: "Subscriber and conversion KPIs" },
      { title: "Marketing Reports", href: "/admin/marketing-reports", desc: "Detailed performance reports" },
      { title: "Email Campaigns", href: "/admin/email-campaigns", desc: "Campaign scheduler" },
      { title: "Email List", href: "/admin/email-list", desc: "Subscriber email database" },
      { title: "Newsletters", href: "/admin/newsletters", desc: "Newsletter manager" },
      { title: "Lead Magnets", href: "/admin/lead-magnets", desc: "Lead magnet catalog" },
      { title: "Lead Capture", href: "/admin/lead-capture", desc: "Capture form builder" },
      { title: "Campaign Analytics", href: "/admin/campaign-analytics", desc: "Campaign performance" },
    ],
  },
  {
    title: "Security",
    description: "Threat monitoring, audit logs and cybersecurity operations.",
    color: "border-red-500",
    badge: "bg-red-500/10 text-red-400",
    modules: [
      { title: "Security Dashboard", href: "/admin/security-dashboard", desc: "SOC overview" },
      { title: "Security Center", href: "/admin/security-center", desc: "Enterprise security hub" },
      { title: "Cybersecurity", href: "/admin/cybersecurity", desc: "Threat and vulnerability management" },
    ],
  },
  {
    title: "Global",
    description: "Regional administration, languages and international expansion.",
    color: "border-cyan-500",
    badge: "bg-cyan-500/10 text-cyan-400",
    modules: [
      { title: "Regional Dashboard", href: "/admin/regional-dashboard", desc: "Region-level KPIs" },
      { title: "Country Dashboard", href: "/admin/country-dashboard", desc: "Country-level metrics" },
      { title: "Regions", href: "/admin/regions", desc: "Region configuration" },
      { title: "Languages", href: "/admin/languages", desc: "Language management" },
      { title: "Language Dashboard", href: "/admin/language-dashboard", desc: "Localization status" },
    ],
  },
  {
    title: "System",
    description: "Platform operations, file management and system configuration.",
    color: "border-gray-500",
    badge: "bg-gray-500/10 text-gray-400",
    modules: [
      { title: "Downloads", href: "/admin/downloads", desc: "Downloadable content catalog" },
      { title: "Provider Operations", href: "/admin/provider-operations", desc: "Operations center" },
      { title: "Settings", href: "/admin/settings", desc: "Platform configuration" },
    ],
  },
];

export default function AdminPortal() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-12">
        <p className="text-xs font-bold tracking-widest text-blue-400 uppercase">
          Administration
        </p>
        <h1 className="mt-3 text-5xl font-black">
          Admin Portal
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Global administration console for Edunancial. Manage content, commerce,
          marketing, security and platform operations worldwide.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`rounded-2xl border-t-2 ${section.color} bg-[#101a2f] p-6`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${section.badge}`}>
                {section.title}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-5">
              {section.description}
            </p>
            <ul className="space-y-1">
              {section.modules.map((mod) => (
                <li key={mod.href}>
                  <Link
                    href={mod.href}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {mod.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {mod.desc}
                      </p>
                    </div>
                    <span className="text-gray-600 group-hover:text-blue-400 transition-colors">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </main>
  );
}
