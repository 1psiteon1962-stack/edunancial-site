"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const columns = [
  {
    titleKey: "footer.learn.title",
    links: [
      { href: "/courses/red", labelKey: "footer.learn.red" },
      { href: "/courses/white", labelKey: "footer.learn.white" },
      { href: "/courses/blue", labelKey: "footer.learn.blue" },
      { href: "/courses", labelKey: "footer.learn.allCourses" },
    ],
  },
  {
    titleKey: "footer.competency.title",
    links: [
      { href: "/dashboard", labelKey: "footer.competency.memberDashboard" },
      { href: "/assessment", labelKey: "footer.competency.assessment" },
      { href: "/passport", labelKey: "footer.competency.financialPassport" },
      { href: "/missions", labelKey: "footer.competency.missionCenter" },
      { href: "/membership", labelKey: "footer.competency.membership" },
    ],
  },
  {
    titleKey: "footer.company.title",
    links: [
      { href: "/our-story", labelKey: "footer.company.ourStory" },
      { href: "/mission", labelKey: "footer.company.mission" },
      { href: "/vision", labelKey: "footer.company.vision" },
      { href: "/features", labelKey: "footer.company.features" },
      { href: "/pricing", labelKey: "footer.company.pricing" },
      { href: "/about", labelKey: "footer.company.about" },
      { href: "/contact", labelKey: "footer.company.contact" },
    ],
  },
  {
    titleKey: "footer.community.title",
    links: [
      { href: "/family", labelKey: "footer.community.family" },
      { href: "/marketplace", labelKey: "footer.community.marketplace" },
      { href: "/community", labelKey: "footer.community.community" },
      { href: "/webinars", labelKey: "footer.community.webinars" },
      { href: "/faq", labelKey: "footer.community.faq" },
    ],
  },
  {
    titleKey: "footer.legal.title",
    links: [
      { href: "/privacy", labelKey: "footer.legal.privacyPolicy" },
      { href: "/terms", labelKey: "footer.legal.termsOfUse" },
      { href: "/membership-terms", labelKey: "footer.legal.membershipTerms" },
      { href: "/beta-terms", labelKey: "footer.legal.betaTerms" },
      { href: "/trust-center", labelKey: "footer.legal.trustCenter" },
      { href: "/security", labelKey: "footer.legal.security" },
      { href: "/cookies", labelKey: "footer.legal.cookiePolicy" },
      { href: "/accessibility", labelKey: "footer.legal.accessibility" },
      { href: "/disclaimer", labelKey: "footer.legal.disclaimer" },
      { href: "/refund", labelKey: "footer.legal.refundPolicy" },
    ],
  },
] as const;

export default function Footer() {
  const { t } = useInternationalPreferences();

  return (
    <footer className="border-t border-slate-800 bg-[#050b17]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-black">{t("footer.identity")}</h2>
        <h3 className="mt-5 text-3xl font-bold text-blue-400">{t("footer.subtitle")}</h3>

        <div className="mt-16 grid gap-10 md:grid-cols-5">
          {columns.map((column) => (
            <div key={column.titleKey}>
              <h4 className="font-bold text-white">{t(column.titleKey)}</h4>
              <div className="mt-5 space-y-3 text-slate-400">
                {column.links.map((link) => (
                  <div key={link.href}>
                    <Link href={link.href} className="hover:text-white">
                      {t(link.labelKey)}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Edunancial. {t("footer.copyright")}</p>
          <p className="max-w-xl text-center md:text-right">
            {t("footer.disclaimer")}{" "}
            <Link href="/disclaimer" className="underline hover:text-slate-300">
              {t("footer.disclaimerLink")}
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
