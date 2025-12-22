import type { Region } from "./region-resolver";

export type Content = {
  title: string;
  description: string;
};

const CONTENT: Record<Region, Content> = {
  NA: {
    title: "Welcome to Edunancial",
    description: "Financial education built for real-world outcomes."
  },
  EU: {
    title: "Welcome to Edunancial (EU)",
    description: "Practical financial literacy for European markets."
  },
  ASIA: {
    title: "Welcome to Edunancial (Asia)",
    description: "Education-first finance for Asia-Pacific regions."
  }
};

export function getContent(region: Region): Content {
  return CONTENT[region];
}
