import { RegionCurriculumContent } from "@/components/RegionCurriculum";

export const regionCurriculumContent: Record<
  string,
  Record<string, RegionCurriculumContent>
> = {
  africa: {
    en: {
      title: "Africa – Entrepreneur & Investor Curriculum",
      description:
        "Foundational financial literacy, entrepreneurship, and scalable investment education designed for African markets.",
      curriculum: [
        "Personal finance fundamentals",
        "Starting a small business",
        "Local and regional market analysis",
        "Digital payments and mobile money",
        "Scaling across borders",
      ],
      pricing: {
        currency: "$",
        monthly: 15,
        annual: 150,
        quarterly: 40,
        lifetime: 399,
        enterprise: "Custom pricing available",
      },
      cta: "Start Learning",
    },
  },

  europe: {
    en: {
      title: "Europe – Advanced Business & Investment Curriculum",
      description:
        "Multi-language business education focused on EU markets, compliance, and cross-border growth.",
      curriculum: [
        "EU business structures",
        "Tax efficiency and compliance",
        "Cross-border investing",
        "Private equity basics",
        "International scaling strategy",
      ],
      pricing: {
        currency: "€",
        monthly: 29,
        annual: 290,
        quarterly: 75,
        lifetime: 699,
        enterprise: "Corporate licensing available",
      },
      cta: "Enroll Now",
    },
  },

  "asia-pacific": {
    en: {
      title: "Asia-Pacific – Growth & Innovation Curriculum",
      description:
        "Technology, manufacturing, and capital-growth education for Asia-Pacific economies.",
      curriculum: [
        "Regional market entry",
        "Manufacturing & supply chains",
        "Technology startups",
        "Capital formation",
        "Export-driven growth",
      ],
      pricing: {
        currency: "$",
        monthly: 25,
        annual: 250,
        quarterly: 65,
        lifetime: 599,
        enterprise: "Enterprise onboarding available",
      },
      cta: "Join the Program",
    },
  },
};region
