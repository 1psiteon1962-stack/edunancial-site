// src/lib/content-resolver.ts

export type RootPageData = {
  title: string;
  description?: string;
  body?: {
    code: string;
  };
};

/**
 * Central content loader for root page
 * This guarantees the function EXISTS for imports
 * and avoids all "module not found" errors
 */
export async function getRootPageData(): Promise<RootPageData> {
  return {
    title: "Edunancial",
    description: "Building financial literacy for the next generation.",
    body: {
      code: "Welcome to Edunancial",
    },
  };
}
