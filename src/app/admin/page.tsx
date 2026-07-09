import Link from "next/link";

const modules = [
  {
    title: "Executive Dashboard",
    href: "/admin/dashboard",
    description: "Global operational metrics and leadership visibility.",
  },
  {
    title: "Communications Platform",
    href: "/admin/communications",
    description: "Campaigns, announcements, reminders, templates, and subscriber tools.",
  },
  {
    title: "Email Operations",
    href: "/admin/email-campaigns",
    description: "Email center with SMS hooks, campaign status, and reminder orchestration.",
  },
  {
    title: "Newsletter Framework",
    href: "/admin/newsletters",
    description: "Editorial calendars, segmented issues, and accessibility-ready digests.",
  },
  {
    title: "Subscriber Intelligence",
    href: "/admin/subscribers",
    description: "Audience quality, opt-in visibility, and member alert prioritization.",
  },
  {
    title: "Book Management",
    href: "/admin/books",
    description: "Manage catalog publishing and supporting content assets.",
  },
  {
    title: "Course Management",
    href: "/admin/courses",
    description: "Control learning experiences, sequencing, and related materials.",
  },
  {
    title: "Customers",
    href: "/admin/customers",
    description: "Review customer records and account support workflows.",
  },
  {
    title: "Memberships",
    href: "/admin/memberships",
    description: "Track member plans, benefits, and lifecycle changes.",
  },
];

export default function AdminPortal() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">
      <h1 className="text-6xl font-black">ADMIN PORTAL</h1>

      <p className="mt-6 max-w-3xl text-xl text-gray-300">
        Global administration console with a complete communications platform for member outreach and lifecycle messaging.
      </p>

      <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            className="rounded-2xl border border-white/10 bg-[#101a2f] p-8 hover:border-blue-500"
          >
            <h2 className="text-3xl font-black">{module.title}</h2>
            <p className="mt-4 text-sm text-slate-300">{module.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
