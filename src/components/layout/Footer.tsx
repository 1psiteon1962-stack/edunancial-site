"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const FOOTER_COLUMNS = [
  {
    titleKey: "footer.col.learn",
    links: [
      { href: "/courses/red", labelKey: "footer.link.courseRed" },
      { href: "/courses/white", labelKey: "footer.link.courseWhite" },
      { href: "/courses/blue", labelKey: "footer.link.courseBlue" },
      { href: "/courses", labelKey: "footer.link.allCourses" },
    ],
  },
  {
    titleKey: "footer.col.competency",
    links: [
      { href: "/dashboard", labelKey: "footer.link.memberDashboard" },
      { href: "/assessment", labelKey: "footer.link.assessment" },
      { href: "/passport", labelKey: "footer.link.financialPassport" },
      { href: "/missions", labelKey: "footer.link.missionCenter" },
      { href: "/membership", labelKey: "footer.link.membership" },
    ],
  },
  {
    titleKey: "footer.col.company",
    links: [
      { href: "/our-story", labelKey: "footer.link.ourStory" },
      { href: "/mission", labelKey: "footer.link.mission" },
      { href: "/vision", labelKey: "footer.link.vision" },
      { href: "/features", labelKey: "footer.link.features" },
      { href: "/pricing", labelKey: "footer.link.pricing" },
      { href: "/about", labelKey: "footer.link.about" },
      { href: "/contact", labelKey: "footer.link.contact" },
    ],
  },
  {
    titleKey: "footer.col.community",
    links: [
      { href: "/family", labelKey: "footer.link.family" },
      { href: "/marketplace", labelKey: "footer.link.marketplace" },
      { href: "/community", labelKey: "footer.link.community" },
      { href: "/webinars", labelKey: "footer.link.webinars" },
      { href: "/faq", labelKey: "footer.link.faq" },
    ],
  },
  {
    titleKey: "footer.col.trustLegal",
    links: [
      { href: "/privacy", labelKey: "footer.link.privacyPolicy" },
      { href: "/terms", labelKey: "footer.link.termsOfUse" },
      { href: "/membership-terms", labelKey: "footer.link.membershipTerms" },
      { href: "/beta-terms", labelKey: "footer.link.betaTerms" },
      { href: "/trust-center", labelKey: "footer.link.trustCenter" },
      { href: "/security", labelKey: "footer.link.security" },
      { href: "/cookies", labelKey: "footer.link.cookiePolicy" },
      { href: "/accessibility", labelKey: "footer.link.accessibility" },
      { href: "/disclaimer", labelKey: "footer.link.disclaimer" },
      { href: "/refund", labelKey: "footer.link.refundPolicy" },
    ],
  },
];

export default function Footer() {
  const { t } = useInternationalPreferences();

  return (
    <footer className="border-t border-slate-800 bg-[#050b17]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-black">{t("footer.identity")}</h2>
        <h3 className="mt-5 text-3xl font-bold text-blue-400">{t("footer.subtitle")}</h3>

        <div className="mt-16 grid gap-10 md:grid-cols-5">
          {FOOTER_COLUMNS.map((column) => (
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
