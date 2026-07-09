import Link from "next/link";

const navSections = [
  {
    section: "EXECUTIVE",
    links: [
      { label: "Command Center", href: "/admin/executive-command-center" },
      { label: "Global Dashboard", href: "/admin/global-dashboard" },
      { label: "Executive Summary", href: "/admin/executive-summary" },
      { label: "Executive Marketing", href: "/admin/executive-marketing" },
      { label: "Profit Dashboard", href: "/admin/profit-dashboard" },
      { label: "KPI Dashboard", href: "/admin/kpi" },
      { label: "Executive Dashboard", href: "/admin/dashboard" },
    ],
  },
  {
    section: "CONTENT",
    links: [
      { label: "Books", href: "/admin/books" },
      { label: "Courses", href: "/admin/courses" },
      { label: "Financial Terms", href: "/admin/terms" },
      { label: "Video Lessons", href: "/admin/video-lessons" },
      { label: "Audio Books", href: "/admin/audiobooks" },
      { label: "Quizzes", href: "/admin/quizzes" },
      { label: "Certificates", href: "/admin/certificates" },
      { label: "Webinars", href: "/admin/webinars" },
      { label: "Videos", href: "/admin/videos" },
      { label: "PDF Library", href: "/admin/pdf-library" },
      { label: "EPUB Manager", href: "/admin/epub" },
      { label: "Book Covers", href: "/admin/covers" },
      { label: "Upload Manager", href: "/admin/uploads" },
    ],
  },
  {
    section: "COMMERCE",
    links: [
      { label: "Customers", href: "/admin/customers" },
      { label: "Memberships", href: "/admin/memberships" },
      { label: "Pricing", href: "/admin/pricing" },
      { label: "Subscribers", href: "/admin/subscribers" },
      { label: "Provider Management", href: "/admin/provider-management" },
    ],
  },
  {
    section: "MARKETING",
    links: [
      { label: "Marketing Dashboard", href: "/admin/marketing-dashboard" },
      { label: "Marketing KPIs", href: "/admin/marketing-kpis" },
      { label: "Marketing Reports", href: "/admin/marketing-reports" },
      { label: "Email Campaigns", href: "/admin/email-campaigns" },
      { label: "Email List", href: "/admin/email-list" },
      { label: "Newsletters", href: "/admin/newsletters" },
      { label: "Lead Magnets", href: "/admin/lead-magnets" },
      { label: "Lead Capture", href: "/admin/lead-capture" },
      { label: "Campaign Analytics", href: "/admin/campaign-analytics" },
    ],
  },
  {
    section: "SECURITY",
    links: [
      { label: "Security Dashboard", href: "/admin/security-dashboard" },
      { label: "Security Center", href: "/admin/security-center" },
      { label: "Cybersecurity", href: "/admin/cybersecurity" },
    ],
  },
  {
    section: "GLOBAL",
    links: [
      { label: "Regional Dashboard", href: "/admin/regional-dashboard" },
      { label: "Country Dashboard", href: "/admin/country-dashboard" },
      { label: "Regions", href: "/admin/regions" },
      { label: "Languages", href: "/admin/languages" },
      { label: "Language Dashboard", href: "/admin/language-dashboard" },
    ],
  },
  {
    section: "SYSTEM",
    links: [
      { label: "Downloads", href: "/admin/downloads" },
      { label: "Provider Operations", href: "/admin/provider-operations" },
      { label: "Settings", href: "/admin/settings" },
    ],
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-[#0a1628] overflow-y-auto">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="block">
          <p className="text-xs font-bold tracking-widest text-blue-400 uppercase">
            Edunancial
          </p>
          <h2 className="text-lg font-black text-white mt-0.5">
            Admin Portal
          </h2>
        </Link>
      </div>

      <nav className="p-4 space-y-6">
        {navSections.map((group) => (
          <div key={group.section}>
            <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 px-2">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
