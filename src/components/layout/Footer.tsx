 "use client";

import Link from "next/link";

import { useNorthAmericaLaunchLanguage } from "@/components/international/BilingualContent";

export default function Footer() {
  const language = useNorthAmericaLaunchLanguage();
  const content = language === "es"
    ? {
        identity: "Edunancial es una plataforma de membresía de alfabetización financiera y competencia financiera.",
        subtitle: "La competencia financiera se construye con acción disciplinada.",
        columns: [
          {
            title: "Aprender",
            links: [
              { href: "/courses/red", label: "RED — Bienes raíces" },
              { href: "/courses/white", label: "WHITE — Activos financieros" },
              { href: "/courses/blue", label: "BLUE — Negocios" },
              { href: "/courses", label: "Todos los cursos" },
            ],
          },
          {
            title: "Competencia",
            links: [
              { href: "/dashboard", label: "Panel del miembro" },
              { href: "/assessment", label: "Evaluación" },
              { href: "/passport", label: "Pasaporte financiero" },
              { href: "/missions", label: "Centro de misiones" },
              { href: "/membership", label: "Membresía" },
            ],
          },
          {
            title: "Empresa",
            links: [
              { href: "/our-story", label: "Nuestra historia" },
              { href: "/mission", label: "Misión" },
              { href: "/vision", label: "Visión" },
              { href: "/features", label: "Funciones" },
              { href: "/pricing", label: "Precios" },
              { href: "/about", label: "Acerca de" },
              { href: "/contact", label: "Contacto" },
            ],
          },
          {
            title: "Comunidad",
            links: [
              { href: "/family", label: "Familia" },
              { href: "/marketplace", label: "Mercado" },
              { href: "/community", label: "Comunidad" },
              { href: "/webinars", label: "Webinarios" },
              { href: "/faq", label: "Preguntas frecuentes" },
            ],
          },
          {
            title: "Confianza y legal",
            links: [
              { href: "/privacy", label: "Privacidad" },
              { href: "/terms", label: "Términos de uso" },
              { href: "/membership-terms", label: "Términos de membresía" },
              { href: "/beta-terms", label: "Términos beta" },
              { href: "/trust-center", label: "Centro de confianza" },
              { href: "/security", label: "Seguridad" },
              { href: "/cookies", label: "Política de cookies" },
              { href: "/accessibility", label: "Accesibilidad / ADA" },
              { href: "/disclaimer", label: "Descargo de responsabilidad" },
              { href: "/refund", label: "Política de reembolso" },
            ],
          },
        ],
        copyright: "Todos los derechos reservados.",
        disclaimer:
          "Edunancial no es una escuela, colegio, universidad, institución vocacional, institución educativa acreditada ni una institución que otorgue títulos. La membresía no produce un grado académico, diploma, licencia profesional ni una credencial educativa regulada. Edunancial ofrece contenido informativo únicamente, no asesoría financiera, de inversión, fiscal, contable ni legal.",
        disclaimerLink: "descargo de responsabilidad",
      }
    : {
        identity: "Edunancial is a financial literacy and financial competency membership platform.",
        subtitle: "Financial competency is built through disciplined action.",
        columns: [
          {
            title: "Learn",
            links: [
              { href: "/courses/red", label: "RED — Real Estate" },
              { href: "/courses/white", label: "WHITE — Paper Assets" },
              { href: "/courses/blue", label: "BLUE — Business" },
              { href: "/courses", label: "All Courses" },
            ],
          },
          {
            title: "Competency",
            links: [
              { href: "/dashboard", label: "Member Dashboard" },
              { href: "/assessment", label: "Assessment" },
              { href: "/passport", label: "Financial Passport" },
              { href: "/missions", label: "Mission Center" },
              { href: "/membership", label: "Membership" },
            ],
          },
          {
            title: "Company",
            links: [
              { href: "/our-story", label: "Our Story" },
              { href: "/mission", label: "Mission" },
              { href: "/vision", label: "Vision" },
              { href: "/features", label: "Features" },
              { href: "/pricing", label: "Pricing" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ],
          },
          {
            title: "Community",
            links: [
              { href: "/family", label: "Family" },
              { href: "/marketplace", label: "Marketplace" },
              { href: "/community", label: "Community" },
              { href: "/webinars", label: "Webinars" },
              { href: "/faq", label: "FAQ" },
            ],
          },
          {
            title: "Trust & Legal",
            links: [
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Use" },
              { href: "/membership-terms", label: "Membership Terms" },
              { href: "/beta-terms", label: "Beta Terms" },
              { href: "/trust-center", label: "Trust Center" },
              { href: "/security", label: "Security" },
              { href: "/cookies", label: "Cookie Policy" },
              { href: "/accessibility", label: "Accessibility / ADA" },
              { href: "/disclaimer", label: "Disclaimer" },
              { href: "/refund", label: "Refund Policy" },
            ],
          },
        ],
        copyright: "All rights reserved.",
        disclaimer:
          "Edunancial is not a school, college, university, vocational institution, accredited educational institution, or degree-granting institution. Membership does not result in an academic degree, diploma, professional license, or regulated educational credential. Edunancial provides informational content only — not financial, investment, tax, accounting, or legal advice.",
        disclaimerLink: "disclaimer",
      };

  return (
    <footer className="border-t border-slate-800 bg-[#050b17]">
      <div className="mx-auto max-w-7xl px-6 py-20">

        <h2 className="text-4xl font-black">
          {content.identity}
        </h2>
        <h3 className="mt-5 text-3xl font-bold text-blue-400">
          {content.subtitle}
        </h3>

        <div className="mt-16 grid gap-10 md:grid-cols-5">
          {content.columns.map((column) => (
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

        <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Edunancial. {content.copyright}</p>
          <p className="text-center md:text-right max-w-xl">
            {content.disclaimer}{" "}
            <Link href="/disclaimer" className="underline hover:text-slate-300">{content.disclaimerLink}</Link>.
          </p>
        </div>

      </div>
    </footer>
  );
}
