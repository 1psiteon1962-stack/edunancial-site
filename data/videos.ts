export type VideoItem = {
  id: string;
  title: string;
  level: 1 | 2 | 3 | 4 | 5;
  language: "en" | "es";
  region?: "US" | "LATAM" | "AFRICA" | "GLOBAL";
  category?: string;
  url?: string; // optional until you upload
};

export const videos: VideoItem[] = [
  {
    id: "l1-foundations-01",
    title: "Level 1: The Foundations (Budget, Debt, Cash Flow)",
    level: 1,
    language: "en",
    region: "GLOBAL",
    category: "Foundations"
  },
  {
    id: "l1-foundations-01-es",
    title: "Nivel 1: Fundamentos (Presupuesto, Deuda, Flujo de Caja)",
    level: 1,
    language: "es",
    region: "GLOBAL",
    category: "Fundamentos"
  }
];
