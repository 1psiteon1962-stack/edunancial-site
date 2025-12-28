export type Offer = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export const OFFERS: Record<string, Offer> = {
  default: {
    id: "default",
    title: "Capital Discipline – Foundation",
    description:
      "Introduction to capital discipline and the Red, White, and Blue framework.",
    price: 0,
  },

  red: {
    id: "red",
    title: "Red Path – Real Assets",
    description:
      "Real estate, tangible assets, leverage, and durability principles.",
    price: 0,
  },

  white: {
    id: "white",
    title: "White Path – Paper Assets",
    description:
      "Markets, liquidity, volatility, and capital timing frameworks.",
    price: 0,
  },

  blue: {
    id: "blue",
    title: "Blue Path – Business & Systems",
    description:
      "Operating businesses, cash flow systems, and scalable structures.",
    price: 0,
  },
};
