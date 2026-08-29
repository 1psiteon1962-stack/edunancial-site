import InvestmentGrowthToolClient from "./InvestmentGrowthToolClient";

export const metadata = {
  title: "Investment Growth Calculator | Edunancial",
  description: "Model recurring investments and compound growth with adjustable contribution, return, time-horizon, and currency assumptions.",
};

export default function InvestmentGrowthToolPage() {
  return <InvestmentGrowthToolClient />;
}
