import { FinancialTerm } from "./termTypes";

export const financialTerms: FinancialTerm[] = [

  {
    id: "profit",
    term: "Profit",
    definition: "Money remaining after all expenses have been paid.",
    category: "blue",
    free: true,
    packId: "business-foundations",
    related: ["revenue", "gross-profit"]
  },

  {
    id: "revenue",
    term: "Revenue",
    definition: "Total income before expenses.",
    category: "blue",
    free: true,
    packId: "business-foundations",
    related: ["profit"]
  },

  {
    id: "cap-rate",
    term: "Cap Rate",
    definition: "Net operating income divided by purchase price or value.",
    category: "red",
    free: false,
    packId: "real-estate-foundations"
  },

  {
    id: "etf",
    term: "ETF",
    definition: "Exchange Traded Fund.",
    category: "white",
    free: false,
    packId: "paper-assets-foundations"
  }

];
