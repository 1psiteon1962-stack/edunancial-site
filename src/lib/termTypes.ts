export type TermColor = "red" | "white" | "blue";

export interface FinancialTerm {
  id: string;
  term: string;
  fullName?: string;
  definition: string;
  category: TermColor;
  free: boolean;
  packId: string;
  related?: string[];
}

export interface TermPack {
  id: string;
  title: string;
  description: string;
  color: TermColor;
  price: number;
  free: boolean;
  icon: string;
}

export const COLORS = {
  red: "#dc2626",
  white: "#ffffff",
  blue: "#2563eb",
};
