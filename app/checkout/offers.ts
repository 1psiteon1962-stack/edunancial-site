// app/checkout/offers.ts

export type Offer = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
};

export const OFFERS: Record<string, Offer> = {
  default: {
    id: "default",
    title: "Getting Started",
    description:
      "Begin your capital discipline journey with foundational access.",
    priceCents: 0,
  },

  discipline: {
    id: "discipline",
    title: "Capital Discipline",
    description:
      "Structured training covering Red (Real Estate), White (Paper Assets), and Blue (Business).",
    priceCents: 0,
  },

  red: {
    id: "red",
    title: "Red Path – Real Estate",
    description:
      "Property fundamentals, leverage mechanics, and capital preservation.",
    priceCents: 0,
  },

  white: {
    id: "white",
    title: "White Path – Paper Assets",
    description:
      "Markets, liquidity, risk, and asymmetric exposure.",
    priceCents: 0,
  },

  blue: {
    id: "blue",
    title: "Blue Path – Business",
    description:
      "Enterprise creation, cash flow control, and scalability logic.",
    priceCents: 0,
  },
};
