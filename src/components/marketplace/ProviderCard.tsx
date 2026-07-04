import { MarketplaceProvider } from "@/types/marketplace";

interface ProviderCardProps {

  provider: MarketplaceProvider;

}

export default function ProviderCard({

  provider,

}: ProviderCardProps) {

  return (

    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold">

        {provider.companyName}

      </h2>

      <p className="mt-2 text-slate-600">

        {provider.category}

      </p>

      <div className="mt-6 space-y-2">

        <div>

          {provider.city}, {provider.state}

        </div>

        <div>

          {provider.country}

        </div>

        <div>

          {provider.phone}

        </div>

        <div>

          {provider.email}

        </div>

      </div>

    </article>

  );

}
