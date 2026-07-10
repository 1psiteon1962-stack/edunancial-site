"use client";

import Link from "next/link";

import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-slate-800 bg-[#050b17]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="text-2xl font-black text-white">EDUNANCIAL</h2>
            <p className="mt-4 max-w-xs text-slate-400">{t("footer.tagline")}</p>
          </div>

          <div>
            <h3 className="font-bold text-white">{t("footer.learn")}</h3>
            <div className="mt-4 space-y-3 text-slate-400">
              <div><Link href="/books" className="hover:text-white">{t("footer.books")}</Link></div>
              <div><Link href="/courses" className="hover:text-white">{t("footer.courses")}</Link></div>
              <div><Link href="/terms" className="hover:text-white">{t("footer.terms")}</Link></div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">{t("footer.company")}</h3>
            <div className="mt-4 space-y-3 text-slate-400">
              <div><Link href="/about" className="hover:text-white">{t("footer.about")}</Link></div>
              <div><Link href="/contact" className="hover:text-white">{t("footer.contact")}</Link></div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">{t("footer.legal")}</h3>
            <div className="mt-4 space-y-3 text-slate-400">
              <div><Link href="/privacy" className="hover:text-white">{t("footer.privacy")}</Link></div>
              <div><Link href="/terms-of-service" className="hover:text-white">{t("footer.terms_service")}</Link></div>
              <div><Link href="/disclaimer" className="hover:text-white">{t("footer.disclaimer")}</Link></div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Edunancial. {t("footer.all_rights_reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
