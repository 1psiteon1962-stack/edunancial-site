import FeatureCard from "./FeatureCard";

export default function ThreePillars() {
return (
<section className="max-w-7xl mx-auto px-6 py-20">

  <h2 className="text-5xl font-black text-center mb-16">
    The Three Pillars
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    <FeatureCard
      color="#dc2626"
      title="RED"
      description="Real Estate. Learn income property, tax liens, tax deeds, financing, leverage, cash flow and wealth creation."
    />

    <FeatureCard
      color="#ffffff"
      title="WHITE"
      description="Paper Assets. Stocks, ETFs, mutual funds, options, dividends, bonds and long-term investing."
    />

    <FeatureCard
      color="#2563eb"
      title="BLUE"
      description="Business. Profit, KPIs, marketing, pricing, scaling and entrepreneurship."
    />

  </div>

</section>

);
}
