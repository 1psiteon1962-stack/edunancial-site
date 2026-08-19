import { canadaIndirectTaxAdapter } from "./canada-adapter";
import { TaxEngineAdapter, TaxQuote, TaxQuoteRequest } from "./architecture";
import { createUsSalesTaxAdapter, UsSalesTaxRuleResolver } from "./us-adapter";

export interface TaxEngineDependencies {
  resolveUsSalesTaxRule: UsSalesTaxRuleResolver;
}

export function createTaxEngine(dependencies: TaxEngineDependencies) {
  const adapters: Record<"US" | "CA", TaxEngineAdapter> = {
    US: createUsSalesTaxAdapter(dependencies.resolveUsSalesTaxRule),
    CA: canadaIndirectTaxAdapter,
  };

  return {
    quote(request: TaxQuoteRequest): TaxQuote {
      const adapter = adapters[request.customer.countryCode];
      return adapter.quote(request);
    },
  };
}
