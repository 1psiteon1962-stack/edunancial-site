const BASE_URL = "https://www.edunancial.com";

const CARIBBEAN_SECTIONS = [
  "legal",
  "privacy",
  "terms",
  "contact",
  "membership",
  "dashboard",
  "assessment",
  "curriculum-upload",
] as const;

export default function sitemap() {
  const staticRoutes = [
    "",
    "/about",
    "/courses",
    "/membership",
    "/levels",
    "/sponsor",
    "/contact",
    "/privacy",
    "/trust-center",
    "/security",
    "/disclaimer",
    "/terms",
    "/refund-policy",
    "/faq",
    "/assessment",
    "/why-edunancial",
    "/caribbean",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date("2025-01-01"),
  }));

  const caribbeanRoutes = [
    { url: `${BASE_URL}/caribbean`, lastModified: new Date("2025-01-01") },
    ...CARIBBEAN_SECTIONS.map((section) => ({
      url: `${BASE_URL}/caribbean/${section}`,
      lastModified: new Date("2025-01-01"),
    })),
  ];

  return [...staticRoutes, ...caribbeanRoutes];
}

