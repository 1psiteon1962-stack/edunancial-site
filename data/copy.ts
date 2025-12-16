type copyshape = {
  heroTitle: string;
  heroBody: string;
  storyTitle: string;
  storyBody: string;
  booksTitle: string;
  booksBody: string;
  coursesTitle: string;
  coursesBody: string;
  appsTitle: string;
  appsBody: string;
  footerNote: string;
};

export const copydata: Record<"en" | "es", Record<string, copyshape>> = {
  en: {
    "us-main": {
      heroTitle: "edunancial",
      heroBody: "education focused on readiness, structure, and durability.",
      storyTitle: "our story",
      storyBody: "discipline before dollars. structure before scale.",
      booksTitle: "books",
      booksBody: "practical books built for action.",
      coursesTitle: "courses",
      coursesBody: "execution-focused learning designed for real progress.",
      appsTitle: "apps",
      appsBody: "tools that support planning, tracking, and decisions.",
      footerNote: "educational content only. not legal, tax, or investment advice."
    },
    latam: {
      heroTitle: "edunancial",
      heroBody: "practical financial education for latam builders.",
      storyTitle: "our story",
      storyBody: "structure, discipline, durability — adapted to local realities.",
      booksTitle: "books",
      booksBody: "bilingual books designed for clarity and action.",
      coursesTitle: "courses",
      coursesBody: "courses designed for execution.",
      appsTitle: "apps",
      appsBody: "tools to support planning and tracking.",
      footerNote: "educational content only. not legal, tax, or investment advice."
    },
    africa: {
      heroTitle: "edunancial",
      heroBody: "practical financial education for african entrepreneurs.",
      storyTitle: "our story",
      storyBody: "build the base first. scale after.",
      booksTitle: "books",
      booksBody: "core titles selected for maximum impact.",
      coursesTitle: "courses",
      coursesBody: "courses focused on execution and durability.",
      appsTitle: "apps",
      appsBody: "lightweight tools for planning and tracking.",
      footerNote: "educational content only. not legal, tax, or investment advice."
    },
    europe: {
      heroTitle: "edunancial",
      heroBody: "structured financial education built for durability.",
      storyTitle: "our story",
      storyBody: "discipline and structure over shortcuts.",
      booksTitle: "books",
      booksBody: "select titles with real-world use.",
      coursesTitle: "courses",
      coursesBody: "courses designed for implementation.",
      appsTitle: "apps",
      appsBody: "tools that support structured decision-making.",
      footerNote: "educational content only. not legal, tax, or investment advice."
    },
    asia: {
      heroTitle: "edunancial",
      heroBody: "execution-first education for high-growth builders.",
      storyTitle: "our story",
      storyBody: "systems that help you execute and scale responsibly.",
      booksTitle: "books",
      booksBody: "core titles built for action.",
      coursesTitle: "courses",
      coursesBody: "courses focused on structure and execution.",
      appsTitle: "apps",
      appsBody: "tools for planning, tracking, and decisions.",
      footerNote: "educational content only. not legal, tax, or investment advice."
    },
    caribbean: {
      heroTitle: "edunancial",
      heroBody: "bilingual financial education for caribbean builders and families.",
      storyTitle: "our story",
      storyBody: "discipline before dollars — structure before scale.",
      booksTitle: "books",
      booksBody: "bilingual books designed for action.",
      coursesTitle: "courses",
      coursesBody: "courses that support execution and durability.",
      appsTitle: "apps",
      appsBody: "tools designed to support structured execution.",
      footerNote: "educational content only. not legal, tax, or investment advice."
    }
  },
  es: {
    "us-main": {
      heroTitle: "edunancial",
      heroBody: "educación enfocada en preparación, estructura y durabilidad.",
      storyTitle: "nuestra historia",
      storyBody: "disciplina antes del dinero. estructura antes de escalar.",
      booksTitle: "libros",
      booksBody: "libros prácticos hechos para la acción.",
      coursesTitle: "cursos",
      coursesBody: "aprendizaje enfocado en ejecutar.",
      appsTitle: "apps",
      appsBody: "herramientas para planificar, medir y decidir.",
      footerNote: "solo educación. no es asesoría legal, fiscal ni de inversión."
    }
  }
};
