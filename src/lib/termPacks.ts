import { TermPack } from "./termTypes";

export const termPacks: TermPack[] = [
  {
    id: "business-foundations",
    title: "Business Foundations",
    description: "50 essential business terms.",
    color: "blue",
    price: 0,
    free: true,
    icon: "💼",
  },
  {
    id: "real-estate-foundations",
    title: "Real Estate Foundations",
    description: "50 essential real estate terms.",
    color: "red",
    price: 0.99,
    free: false,
    icon: "🏠",
  },
  {
    id: "paper-assets-foundations",
    title: "Paper Assets Foundations",
    description: "50 investing terms.",
    color: "white",
    price: 0.99,
    free: false,
    icon: "📈",
  },
];
