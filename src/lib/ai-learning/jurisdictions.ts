export interface JurisdictionDefinition {
  code: string;
  name: string;
  parentJurisdiction: string | null;
  authoritativeDomains: string[];
}

/**
 * Learning jurisdictions are substantive-content choices, not language choices.
 * Locale must never be used to infer one of these values.
 */
export const JURISDICTIONS: Record<string, JurisdictionDefinition> = {
  UNIVERSAL: { code: "UNIVERSAL", name: "Universal concepts", parentJurisdiction: null, authoritativeDomains: [] },
  US: { code: "US", name: "United States", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["irs.gov", "consumerfinance.gov", "sec.gov", "usa.gov"] },
  PR: { code: "PR", name: "Puerto Rico", parentJurisdiction: "US", authoritativeDomains: ["hacienda.pr.gov", "estado.pr.gov", "oslpr.org"] },
  CA: { code: "CA", name: "Canada", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["canada.ca", "bankofcanada.ca", "fcac-acfc.gc.ca"] },
  "CA-QC": { code: "CA-QC", name: "Quebec, Canada", parentJurisdiction: "CA", authoritativeDomains: ["quebec.ca", "revenuquebec.ca"] },
  DE: { code: "DE", name: "Germany", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["bund.de", "bundesfinanzministerium.de", "bafin.de", "gesetze-im-internet.de"] },
  CH: { code: "CH", name: "Switzerland", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["admin.ch", "estv.admin.ch", "finma.ch", "snb.ch"] },
  AT: { code: "AT", name: "Austria", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["oesterreich.gv.at", "bmf.gv.at", "fma.gv.at"] },
  FR: { code: "FR", name: "France", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["service-public.fr", "impots.gouv.fr", "legifrance.gouv.fr", "amf-france.org"] },
  ES: { code: "ES", name: "Spain", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["administracion.gob.es", "agenciatributaria.es", "boe.es", "cnmv.es"] },
  PT: { code: "PT", name: "Portugal", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["gov.pt", "portaldasfinancas.gov.pt", "dre.pt"] },
  BR: { code: "BR", name: "Brazil", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["gov.br", "bcb.gov.br", "cvm.gov.br"] },
  NL: { code: "NL", name: "Netherlands", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["government.nl", "belastingdienst.nl", "afm.nl"] },
  GB: { code: "GB", name: "United Kingdom", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["gov.uk", "fca.org.uk", "bankofengland.co.uk"] },
  UG: { code: "UG", name: "Uganda", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["go.ug", "ura.go.ug", "bou.or.ug", "cmauganda.co.ug"] },
  KE: { code: "KE", name: "Kenya", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["go.ke", "kra.go.ke", "centralbank.go.ke", "cma.or.ke"] },
  TZ: { code: "TZ", name: "Tanzania", parentJurisdiction: "UNIVERSAL", authoritativeDomains: ["go.tz", "tra.go.tz", "bot.go.tz"] },
};

export function getJurisdiction(code: string | null | undefined): JurisdictionDefinition | null {
  if (!code) return null;
  return JURISDICTIONS[code.trim().toUpperCase()] ?? null;
}

export function getJurisdictionInheritanceChain(code: string): JurisdictionDefinition[] {
  const chain: JurisdictionDefinition[] = [];
  const seen = new Set<string>();
  let current = getJurisdiction(code);

  while (current && !seen.has(current.code)) {
    chain.push(current);
    seen.add(current.code);
    current = current.parentJurisdiction ? getJurisdiction(current.parentJurisdiction) : null;
  }

  return chain;
}

export function getAuthoritativeDomains(code: string): string[] {
  return Array.from(
    new Set(getJurisdictionInheritanceChain(code).flatMap((entry) => entry.authoritativeDomains)),
  );
}
