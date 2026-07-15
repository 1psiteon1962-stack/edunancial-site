import Link from "next/link";

import BilingualContent from "@/components/international/BilingualContent";
import { courseList } from "@/data/course-platform";

export const metadata = {
  title: "Courses | Edunancial",
};

const featured = courseList.filter((c) => c.isFeatured);

const enTracks = [
  {
    color: "RED",
    title: "Real Estate Competency",
    description: "Residential • Commercial • Tax Liens • Tax Deeds • 1031 Exchanges • Creative Financing",
    href: "/courses/red",
    bg: "bg-red-700",
  },
  {
    color: "WHITE",
    title: "Financial Asset Competency",
    description: "Budgeting • Credit • Stocks • ETFs • Options • Precious Metals • Retirement",
    href: "/courses/white",
    bg: "bg-slate-200 text-slate-900",
  },
  {
    color: "BLUE",
    title: "Business Competency",
    description: "Entrepreneurship • Marketing • KPIs • Profit • Leadership • Scaling",
    href: "/courses/blue",
    bg: "bg-blue-700",
  },
];

const esTracks = [
  {
    color: "RED",
    title: "Bienes raíces",
    description: "Alquileres, financiamiento creativo, gravámenes fiscales y crecimiento patrimonial a largo plazo.",
    href: "/courses/red",
    bg: "bg-red-700",
  },
  {
    color: "WHITE",
    title: "Activos financieros",
    description: "Presupuesto, acciones, ETF, opciones, metales preciosos y cuentas de retiro.",
    href: "/courses/white",
    bg: "bg-slate-200 text-slate-900",
  },
  {
    color: "BLUE",
    title: "Negocios",
    description: "Emprendimiento, KPI, utilidades, marketing, liderazgo y sistemas.",
    href: "/courses/blue",
    bg: "bg-blue-700",
  },
];

const frTracks = [
  {
    color: "RED",
    title: "Compétence en immobilier",
    description: "Résidentiel • Commercial • Privilèges fiscaux • Titres fiscaux • Échanges 1031 • Financement créatif",
    href: "/courses/red",
    bg: "bg-red-700",
  },
  {
    color: "WHITE",
    title: "Compétence en actifs financiers",
    description: "Budget • Crédit • Actions • FNB • Options • Métaux précieux • Retraite",
    href: "/courses/white",
    bg: "bg-slate-200 text-slate-900",
  },
  {
    color: "BLUE",
    title: "Compétence en affaires",
    description: "Entrepreneuriat • Marketing • KPI • Profit • Leadership • Mise à l'échelle",
    href: "/courses/blue",
    bg: "bg-blue-700",
  },
];

function FeaturedGrid({
  heading,
  linkLabel,
}: {
  heading: string;
  linkLabel: string;
}) {
  return (
    <div className="mt-24">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-black">{heading}</h2>
        <Link href="/course-catalog" className="text-sm font-bold text-yellow-400 hover:text-yellow-300">
          {linkLabel}
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:border-slate-600"
          >
            <div className={`h-1.5 w-full ${course.color.startsWith("bg-slate-2") ? "bg-slate-300" : course.color}`} />
            <div className="p-5">
              {course.isFree && (
                <span className="mb-3 inline-block rounded-full bg-green-900 px-2 py-0.5 text-xs font-bold text-green-300">
                  FREE
                </span>
              )}
              <h3 className="font-black transition group-hover:text-yellow-400">{course.title}</h3>
              <p className="mt-2 text-xs text-slate-400">{course.category} · {course.difficulty}</p>
              <p className="mt-3 text-xs text-slate-500">📚 {course.lessons.length} lessons · ⏱ {course.totalDuration}</p>
              <div className="mt-3 flex items-center gap-1 text-xs">
                <span className="text-yellow-400">{course.rating}</span>
                <span className="text-yellow-400">★</span>
                <span className="text-slate-500">({course.reviewCount})</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CourseLayout({
  label,
  title,
  intro,
  tracks,
  trackLabel,
  primary,
  secondary,
  note,
  featuredHeading,
  featuredLink,
}: {
  label: string;
  title: string;
  intro: string;
  tracks: { color: string; title: string; description: string; href: string; bg: string }[];
  trackLabel: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  note?: { title: string; body: string };
  featuredHeading: string;
  featuredLink: string;
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">{label}</p>
        <h1 className="mt-4 text-5xl font-black md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-300">{intro}</p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tracks.map((track) => (
            <Link key={track.color} href={track.href} className={`${track.bg} rounded-2xl p-10 transition hover:opacity-90`}>
              <h2 className="text-5xl font-black">{track.color}</h2>
              <h3 className="mt-6 text-2xl font-bold">{track.title}</h3>
              <p className="mt-4 text-lg opacity-80">{track.description}</p>
              <p className="mt-8 text-sm font-bold">{trackLabel}</p>
            </Link>
          ))}
        </div>

        {note && (
          <div className="mt-16 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-8 text-slate-200">
            <h2 className="text-2xl font-black text-white">{note.title}</h2>
            <p className="mt-4 max-w-3xl leading-8">{note.body}</p>
          </div>
        )}

        {!note && <FeaturedGrid heading={featuredHeading} linkLabel={featuredLink} />}

        <div className="mt-20 flex flex-col gap-4 sm:flex-row">
          <Link href={primary.href} className="rounded-xl bg-yellow-500 px-8 py-4 text-center font-black text-black transition hover:bg-yellow-400">
            {primary.label}
          </Link>
          <Link href={secondary.href} className="rounded-xl border border-slate-600 px-8 py-4 text-center font-bold text-slate-300 transition hover:bg-slate-800">
            {secondary.label}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function CoursesPage() {
  return (
    <BilingualContent
      en={
        <CourseLayout
          label="COURSE LIBRARY"
          title="Build Financial Competency"
          intro="Financial literacy provides the foundation. Financial competency is built through disciplined action."
          tracks={enTracks}
          trackLabel="Explore Track →"
          primary={{ href: "/course-catalog", label: "Browse All Courses" }}
          secondary={{ href: "/my-courses", label: "My Learning Dashboard" }}
          featuredHeading="Featured Courses"
          featuredLink="View All Courses →"
        />
      }
      es={
        <CourseLayout
          label="Biblioteca de cursos"
          title="Construya competencia financiera"
          intro="La alfabetización financiera aporta la base. La competencia financiera se construye con acción disciplinada."
          tracks={esTracks}
          trackLabel="Explorar ruta →"
          primary={{ href: "/membership", label: "Ver membresías" }}
          secondary={{ href: "/course-progress", label: "Ver progreso" }}
          note={{
            title: "Detalles completos en español en desarrollo",
            body: "El catálogo completo de cursos y las páginas de detalle en español para Norteamérica continúan en preparación. Mientras tanto, cada ruta RED, WHITE y BLUE ya muestra el panorama general, los recursos planeados y un siguiente paso claro.",
          }}
          featuredHeading="Cursos destacados"
          featuredLink="Ver todos los cursos →"
        />
      }
      fr={
        <CourseLayout
          label="BIBLIOTHÈQUE DE COURS"
          title="Développez vos compétences financières"
          intro="La littératie financière fournit la base. La compétence financière se construit par une action disciplinée."
          tracks={frTracks}
          trackLabel="Explorer la filière →"
          primary={{ href: "/course-catalog", label: "Parcourir tous les cours" }}
          secondary={{ href: "/my-courses", label: "Mon tableau d'apprentissage" }}
          featuredHeading="Cours en vedette"
          featuredLink="Voir tous les cours →"
        />
      }
    />
  );
}
