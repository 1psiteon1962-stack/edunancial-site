import { canadaIndirectTaxAdapter } from "./canada-adapter";
import { createManualReviewQuote, TaxEngineAdapter, TaxQuote, TaxQuoteRequest } from "./architecture";
import { createUsSalesTaxAdapter, UsSalesTaxRuleResolver } from "./us-adapter";

export interface TaxEngineDependencies {
  resolveUsSalesTaxRule: UsSalesTaxRuleResolver;
  regionalAdapters?: TaxEngineAdapter[];
}

export function createTaxEngine(dependencies: TaxEngineDependencies) {
  const adapters = new Map<string, TaxEngineAdapter>();
  adapters.set("US", createUsSalesTaxAdapter(dependencies.resolveUsSalesTaxRule));
  adapters.set("CA", canadaIndirectTaxAdapter);
  for (const adapter of dependencies.regionalAdapters ?? []) adapters.set(adapter.countryCode.toUpperCase(), adapter);

  return {
    quote(request: TaxQuoteRequest): TaxQuote {
      const countryCode = request.customer.countryCode.trim().toUpperCase();
      const adapter = adapters.get(countryCode);
      if (!adapter) {
        return createManualReviewQuote(request, `No verified tax adapter is active for ${countryCode}; transaction requires compliance review before tax is assumed.`);
      }
      return adapter.quote(request);
    },
    supportedCountries(): string[] {
      return [...adapters.keys()].sort();
    },
  };
}
