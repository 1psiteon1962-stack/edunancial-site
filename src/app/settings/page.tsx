import Link from "next/link";

const settingsSections = [
  {
    title: "Profile",
    description: "Update your personal details, contact information, and account profile.",
    href: "/settings/profile",
  },
  {
    title: "Password & Security",
    description: "Manage your password, two-factor authentication, and login protection.",
    href: "/settings/security",
  },
  {
    title: "Notifications",
    description: "Control email and in-app updates about courses, billing, and security.",
    href: "/settings/notifications",
  },
  {
    title: "Language",
    description: "Choose your preferred language and regional learning experience.",
    href: "/settings/language",
  },
  {
    title: "Privacy",
    description: "Review privacy controls, data requests, and consent preferences.",
    href: "/settings/privacy",
  },
];

export default function Settings() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
          ACCOUNT SETTINGS
        </p>
        <h1 className="mt-6 text-5xl font-black">Account Settings</h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Manage the preferences, security controls, and account details that shape your
          Edunancial experience.
        </p>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {settingsSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-xl border border-white/10 bg-slate-900 p-8 transition hover:border-blue-500"
            >
              <h2 className="text-2xl font-black">{section.title}</h2>
              <p className="mt-4 text-slate-300">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
