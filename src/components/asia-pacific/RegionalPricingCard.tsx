import { getApacPricing } from "@/config/asia-pacific/pricing";
import { formatCurrency } from "@/lib/currencyEngine";

interface Props {
  currency: string;
  locale?: string;
}

export default function RegionalPricingCard({ currency, locale }: Props) {
  const pricing = getApacPricing(currency);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
      <p className="text-xs font-black uppercase tracking-widest text-yellow-400">
        {currency} Pricing
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {pricing.products.map((product) => (
          <div key={product.sku} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-bold text-white">{product.label}</p>
            <p className="mt-1 text-2xl font-black text-yellow-400">
              {formatCurrency(product.price, pricing.currency, locale)}
            </p>
            {product.description && (
              <p className="mt-2 text-sm text-slate-400">{product.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
