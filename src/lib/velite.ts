export interface RootPageData {
  title: string;
  description: string;
}

export async function getRootPage(): Promise<RootPageData> {
  // 🔒 HARD SAFE FALLBACK (NO CMS / NO GENERATOR REQUIRED)

  return {
    title: "Edunancial",
    description:
      "Where Education and Financial Literacy Meet. We Are America in Action.",
  };
}
