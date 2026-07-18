"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function Footer() {
  const { t } = useInternationalPreferences();

  const columns = [
    {
      title: t("footer.col.learn"),
      links: [
        { href: "/courses/red", label: t("footer.link.red") },
        { href: "/courses/white", label: t("footer.link.white") },
        { href: "/courses/blue", label: t("footer.link.blue") },
        { href: "/courses", label: t("footer.link.allCourses") },
      ],
    },
    {
      title: t("footer.col.competency"),
      links: [
        { href: "/dashboard", label: t("footer.link.dashboard") },
        { href: "/assessment", label: t("footer.link.assessment") },
        { href: "/passport", label: t("footer.link.passport") },
        { href: "/missions", label: t("footer.link.missionCenter") },
        { href: "/membership", label: t("footer.link.membership") },
      ],
    },
    {
      title: t("footer.col.company"),
      links: [
        { href: "/our-story", label: t("footer.link.ourStory") },
        { href: "/mission", label: t("footer.link.mission") },
        { href: "/vision", label: t("footer.link.vision") },
        { href: "/features", label: t("footer.link.features") },
        { href: "/pricing", label: t("footer.link.pricing") },
        { href: "/about", label: t("footer.link.about") },
        { href: "/contact", label: t("footer.link.contact") },
      ],
    },
    {
      title: t("footer.col.community"),
      links: [
        { href: "/family", label: t("footer.link.family") },
        { href: "/marketplace", label: t("footer.link.marketplace") },
        { href: "/community", label: t("footer.link.community") },
        { href: "/webinars", label: t("footer.link.webinars") },
        { href: "/faq", label: t("footer.link.faq") },
      ],
    },
    {
      title: t("footer.col.trustLegal"),
      links: [
        { href: "/privacy", label: t("footer.link.privacy") },
        { href: "/terms", label: t("footer.link.terms") },
        { href: "/membership-terms", label: t("footer.link.membershipTerms") },
        { href: "/beta-terms", label: t("footer.link.betaTerms") },
        { href: "/trust-center", label: t("footer.link.trustCenter") },
        { href: "/security", label: t("footer.link.security") },
        { href: "/cookies", label: t("footer.link.cookies") },
        { href: "/accessibility", label: t("footer.link.accessibility") },
        { href: "/disclaimer", label: t("footer.link.disclaimer") },
        { href: "/refund", label: t("footer.link.refund") },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-800 bg-[#050b17]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-black">{t("footer.identity")}</h2>
        <h3 className="mt-5 text-3xl font-bold text-blue-400">{t("footer.subtitle")}</h3>

        <div className="mt-16 grid gap-10 md:grid-cols-5">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-bold text-white">{column.title}</h4>
              <div className="mt-5 space-y-3 text-slate-400">
                {column.links.map((link) => (
                  <div key={link.href}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Edunancial. {t("footer.copyright")}
          </p>
          <p className="max-w-xl text-center md:text-right">
            {t("footer.disclaimer")}{" "}
            <Link href="/disclaimer" className="underline hover:text-slate-300">
              {t("footer.disclaimerLink")}
            </Link>
            .
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <Link href="/cu" className="text-[10px] uppercase tracking-[0.35em] text-slate-600 hover:text-slate-400">
            CU
          </Link>
        </div>
      </div>
    </footer>
  );
}
