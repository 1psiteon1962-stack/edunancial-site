export type TermColor = "red" | "white" | "blue";

export type TermCard = {
  term: string;
  full: string;
  definition: string;
};

export type TermPack = {
  id: string;
  color: TermColor;
  title: string;
  subtitle: string;
  free: boolean;
  price: number | null;
  cards: TermCard[];
};

export const TERM_COLORS = {
  red: {
    hex: "#dc2626",
    label: "Real Estate",
    emoji: "🏠",
  },
  white: {
   
