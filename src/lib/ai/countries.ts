export interface CountryReadiness {

  countryId: string;

  economics: number;

  education: number;

  financialSystem: number;

  marketplace: number;

  regulations: number;

  launchReady: boolean;

}

export const readiness: CountryReadiness[] = [];
