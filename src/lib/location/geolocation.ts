export interface VisitorLocation {
  countryId: string;
  regionId?: string;
  cityId?: string;

  ip?: string;
  language?: string;
  currency?: string;
}

export function getDefaultLocation(): VisitorLocation {
  return {
    countryId: "us",
    regionId: "ca",
    cityId: "los-angeles",
    language: "en",
    currency: "USD",
  };
}

export function isUnitedStates(location: VisitorLocation) {
  return location.countryId === "us";
}

export function isCanada(location: VisitorLocation) {
  return location.countryId === "ca";
}

export function isAfrica(location: VisitorLocation) {
  return ["ug", "ng", "za", "eg", "dz", "ma"].includes(
    location.countryId
  );
}
