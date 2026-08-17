import { normalizeLearningJurisdiction } from "./localization";

export interface JurisdictionPolicy {
  code: string;
  parentJurisdiction: string | null;
  authoritativeDomains: string[];
}

const POLICIES: Record<string, JurisdictionPolicy> = {
  US: {
    code: "US",
    parentJurisdiction: null,
    authoritativeDomains: ["irs.gov", "sec.gov", "consumerfinance.gov", "usa.gov", "congress.gov"],
  },
  PR: {
    code: "PR",
    parentJurisdiction: "US",
    authoritativeDomains: ["hacienda.pr.gov", "estado.pr.gov", "oslpr.org", "poderjudicial.pr"],
  },
  CA: {
    code: "CA",
    parentJurisdiction: null,
    authoritativeDomains: ["canada.ca", "cra-arc.gc.ca", "bankofcanada.ca", "fcac-acfc.gc.ca", "justice.gc.ca"],
  },
  DE: {
    code: "DE",
    parentJurisdiction: null,
    authoritativeDomains: ["bundesfinanzministerium.de", "gesetze-im-internet.de", "bafin.de", "bundesbank.de"],
  },
  CH: {
    code: "CH",
    parentJurisdiction: null,
    authoritativeDomains: ["admin.ch", "estv.admin.ch", "finma.ch", "snb.ch"],
  },
  FR: {
    code: "FR",
    parentJurisdiction: null,
    authoritativeDomains: ["service-public.fr", "impots.gouv.fr", "economie.gouv.fr", "legifrance.gouv.fr", "amf-france.org"],
  },
  PT: {
    code: "PT",
    parentJurisdiction: null,
    authoritativeDomains: ["portaldasfinancas.gov.pt", "dre.pt", "bportugal.pt", "cmvm.pt"],
  },
  BR: {
    code: "BR",
    parentJurisdiction: null,
    authoritativeDomains: ["gov.br", "receita.economia.gov.br", "bcb.gov.br", "cvm.gov.br"],
  },
  NL: {
    code: "NL",
    parentJurisdiction: null,
    authoritativeDomains: ["government.nl", "belastingdienst.nl", "dnb.nl", "afm.nl", "wetten.overheid.nl"],
  },
  UG: {
    code: "UG",
    parentJurisdiction: null,
    authoritativeDomains: ["ura.go.ug", "bou.or.ug", "ulii.org", "businesslicences.go.ug"],
  },
  KE: {
    code: "KE",
    parentJurisdiction: null,
    authoritativeDomains: ["kra.go.ke", "centralbank.go.ke", "kenyalaw.org", "cma.or.ke"],
  },
  TZ: {
    code: "TZ",
    parentJurisdiction: null,
    authoritativeDomains: ["tra.go.tz", "bot.go.tz", "tanzlii.org", "cmsa.go.tz"],
  },
};

export function getJurisdictionPolicy(value: string): JurisdictionPolicy {
  const code = normalizeLearningJurisdiction(value);
  return (
    POLICIES[code] ?? {
      code,
      parentJurisdiction: null,
      authoritativeDomains: [],
    }
  );
}

export function getJurisdictionInheritanceChain(value: string): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  let current: string | null = normalizeLearningJurisdiction(value);

  while (current && !seen.has(current)) {
    seen.add(current);
    result.push(current);
    current = getJurisdictionPolicy(current).parentJurisdiction;
  }

  result.push("UNIVERSAL");
  return result;
}
