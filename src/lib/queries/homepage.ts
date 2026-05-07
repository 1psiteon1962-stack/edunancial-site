// src/lib/queries/homepage.ts

export type HomeClientModule = {
  id: string;
  title: string;
  description: string;
};

export type HomePageData = {
  title: string;
  description: string;
  clientModules: HomeClientModule[];
};

export async function getHomePage(): Promise<HomePageData> {
  return {
    title: "Edunancial",
    description:
      "Financial education, business structure, and global growth tools.",
    clientModules: [
      {
        id: "financial-literacy",
        title: "Financial Literacy",
        description:
          "Learn money, credit, investing, business structure, and wealth-building systems.",
      },
      {
        id: "business-structure",
        title: "Business Structure",
        description:
          "Understand entities, compliance, contracts, ownership, and operating discipline.",
      },
      {
        id: "global-growth",
        title: "Global Growth",
        description:
          "Explore practical frameworks for building and scaling across regions.",
      },
    ],
  };
}

export async function getHomePageData(): Promise<HomePageData> {
  return getHomePage();
}

export async function getHomepage(): Promise<HomePageData> {
  return getHomePage();
}
