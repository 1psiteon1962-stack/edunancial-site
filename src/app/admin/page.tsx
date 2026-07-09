import Link from "next/link";

const modules = [
  {
    title: "Executive Dashboard",
    href: "/admin/dashboard",
  },
  {
    title: "Digital Library",
    href: "/admin/library",
  },
  {
    title: "Book Management",
    href: "/admin/books",
  },
  {
    title: "Course Management",
    href: "/admin/courses",
  },
  {
    title: "Financial Terms",
    href: "/admin/terms",
  },
  {
    title: "Customers",
    href: "/admin/customers",
  },
  {
    title: "Regions",
    href: "/admin/regions",
  },
  {
    title: "Languages",
    href: "/admin/languages",
  },
  {
    title: "KPI Center",
    href: "/admin/kpis",
  },
  {
    title: "System Settings",
    href: "/admin/settings",
  },
];

export default function AdminPortal() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">
      <h1 className="text-6xl font-black">
        ADMIN PORTAL
      </h1>

      <p className="mt-6 text-xl text-gray-300">
        Global Administration Console
      </p>

      <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            className="rounded-2xl border border-white/10 bg-[#101a2f] p-8 hover:border-blue-500"
          >
            <h2 className="text-3xl font-black">
              {module.title}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
