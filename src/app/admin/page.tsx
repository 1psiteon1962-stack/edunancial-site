import Link from "next/link";

interface Module {
  title: string;
  href: string;
  icon: string;
  description: string;
}

interface Section {
  title: string;
  modules: Module[];
}

const SECTIONS: Section[] = [
  {
    title: "Overview",
    modules: [
      { title: "Executive Dashboard", href: "/admin/dashboard", icon: "📊", description: "Real-time platform KPIs and quick actions." },
      { title: "Analytics", href: "/admin/analytics", icon: "📈", description: "Growth, revenue, and engagement analytics." },
    ],
  },
  {
    title: "Users",
    modules: [
      { title: "User Management", href: "/admin/users", icon: "👥", description: "Manage members, roles, and account status." },
      { title: "Role Management", href: "/admin/roles", icon: "🔐", description: "Configure permissions for admin roles." },
    ],
  },
  {
    title: "Content",
    modules: [
      { title: "Course Management", href: "/admin/courses", icon: "🎓", description: "Create, schedule, and publish courses." },
      { title: "CMS", href: "/admin/cms", icon: "📝", description: "Manage blog, news, FAQs, and legal pages." },
      { title: "Media Library", href: "/admin/media", icon: "🖼️", description: "Organize images, PDFs, video, and audio." },
    ],
  },
  {
    title: "Commerce",
    modules: [
      { title: "Memberships", href: "/admin/memberships", icon: "💳", description: "Manage membership plans and billing." },
      { title: "Pricing", href: "/admin/pricing", icon: "💲", description: "Configure course and plan pricing." },
    ],
  },
  {
    title: "Marketing",
    modules: [
      { title: "Email Campaigns", href: "/admin/email-campaigns", icon: "✉️", description: "Build and send email campaigns." },
      { title: "Lead Management", href: "/admin/lead-capture", icon: "🧲", description: "Track and convert incoming leads." },
    ],
  },
  {
    title: "Reports",
    modules: [
      { title: "KPI Center", href: "/admin/kpi", icon: "🎯", description: "Company-wide key performance indicators." },
      { title: "Marketing Reports", href: "/admin/marketing-reports", icon: "📑", description: "Campaign performance reporting." },
    ],
  },
  {
    title: "Settings",
    modules: [
      { title: "System Config", href: "/admin/config", icon: "⚙️", description: "Global settings, feature flags, and branding." },
      { title: "Audit Log", href: "/admin/audit", icon: "🛡️", description: "Review all administrative activity." },
    ],
  },
];

export default function AdminPortal() {
  const now = new Date();

  return (
    <div className="space-y-12">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 to-transparent p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-400">
          {now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h1 className="mt-2 text-4xl font-black text-white sm:text-6xl">Welcome back, Admin</h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-300">
          This is your Edunancial Administration Portal — manage users, content, commerce, and platform
          configuration from one place.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <section key={section.title}>
          <h2 className="text-2xl font-black text-white">{section.title}</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {section.modules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="group rounded-2xl border border-white/10 bg-[#101a2f] p-6 transition hover:border-blue-500"
              >
                <span className="text-3xl" aria-hidden="true">{module.icon}</span>
                <h3 className="mt-4 text-xl font-black text-white group-hover:text-blue-400">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400">{module.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
