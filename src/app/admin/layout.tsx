"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

interface NavLink {
  label: string;
  href: string;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    links: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    title: "Users",
    links: [
      { label: "User Management", href: "/admin/users" },
      { label: "Role Management", href: "/admin/roles" },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "Course Management", href: "/admin/courses" },
      { label: "CMS", href: "/admin/cms" },
      { label: "Media Library", href: "/admin/media" },
    ],
  },
  {
    title: "Commerce",
    links: [
      { label: "Memberships", href: "/admin/memberships" },
      { label: "Pricing", href: "/admin/pricing" },
    ],
  },
  {
    title: "Marketing",
    links: [
      { label: "Email Campaigns", href: "/admin/email-campaigns" },
      { label: "Lead Management", href: "/admin/lead-capture" },
    ],
  },
  {
    title: "Reports",
    links: [
      { label: "KPI Center", href: "/admin/kpi" },
      { label: "Marketing Reports", href: "/admin/marketing-reports" },
    ],
  },
  {
    title: "Settings",
    links: [
      { label: "System Config", href: "/admin/config" },
      { label: "Audit Log", href: "/admin/audit" },
    ],
  },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">
          E
        </div>
        <div>
          <p className="text-sm font-black leading-tight text-white">Edunancial</p>
          <p className="text-xs font-bold leading-tight text-blue-400">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6" aria-label="Admin navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {group.title}
            </p>
            <ul className="mt-2 space-y-1">
              {group.links.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        active
                          ? "border border-blue-500 bg-blue-600/20 text-blue-400"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
            AD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">Admin User</p>
            <p className="truncate text-xs text-gray-400">admin@edunancial.com</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-4 block rounded-xl border border-white/10 px-3 py-2 text-center text-xs font-bold text-gray-300 hover:bg-white/5"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

function pageTitleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] ?? "admin";
  if (last === "admin") return "Admin Portal";
  return last
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/admin";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex bg-[#08101f] text-white">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 flex-shrink-0 border-r border-white/10 bg-[#0b1526] lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-50 h-full w-72 border-r border-white/10 bg-[#0b1526]">
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#0b1526] px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/5 lg:hidden"
            >
              <span aria-hidden="true">☰</span>
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Edunancial / Admin
              </p>
              <h2 className="text-lg font-black text-white">{pageTitleFromPath(pathname)}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="View notifications"
              className="relative rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/5"
            >
              <span aria-hidden="true">🔔</span>
              <span
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                aria-hidden="true"
              >
                3
              </span>
              <span className="sr-only">3 unread notifications</span>
            </button>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
              aria-label="Admin profile"
            >
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
