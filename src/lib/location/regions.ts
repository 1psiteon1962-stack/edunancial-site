export interface Region {
  id: string;
  countryId: string;
  name: string;
}

export const regions: Region[] = [

  // ===========================
  // UNITED STATES
  // ===========================

  { id: "ca", countryId: "us", name: "California" },
  { id: "az", countryId: "us", name: "Arizona" },
  { id: "or", countryId: "us", name: "Oregon" },
  { id: "wa", countryId: "us", name: "Washington" },
  { id: "nv", countryId: "us", name: "Nevada" },
  { id: "tx", countryId: "us", name: "Texas" },
  { id: "fl", countryId: "us", name: "Florida" },
  { id: "ny", countryId: "us", name: "New York" },

  // ===========================
  // CANADA
  // ===========================

  { id: "on", countryId: "ca", name: "Ontario" },
  { id: "ab", countryId: "ca", name: "Alberta" },
  { id: "bc", countryId: "ca", name: "British Columbia" },
  { id: "qc", countryId: "ca", name: "Quebec" },

  // ===========================
  // UGANDA
  // ===========================

  { id: "ug-central", countryId: "ug", name: "Central Region" },
  { id: "ug-eastern", countryId: "ug", name: "Eastern Region" },
  { id: "ug-northern", countryId: "ug", name: "Northern Region" },
  { id: "ug-western", countryId: "ug", name: "Western Region" },

  // ===========================
  // NIGERIA
  // ===========================

  { id: "ng-lagos", countryId: "ng", name: "Lagos" },
  { id: "ng-fct", countryId: "ng", name: "Federal Capital Territory" },
  { id: "ng-kano", countryId: "ng", name: "Kano" },
  { id: "ng-rivers", countryId: "ng", name: "Rivers" },
  { id: "ng-oyo", countryId: "ng", name: "Oyo" },
  { id: "ng-kaduna", countryId: "ng", name: "Kaduna" },

  // ===========================
  // SOUTH AFRICA
  // ===========================

  { id: "za-gauteng", countryId: "za", name: "Gauteng" },
  { id: "za-western-cape", countryId: "za", name: "Western Cape" },
  { id: "za-kwazulu", countryId: "za", name: "KwaZulu-Natal" },
  { id: "za-eastern-cape", countryId: "za", name: "Eastern Cape" },

  // ===========================
  // EGYPT
  // ===========================

  { id: "eg-cairo", countryId: "eg", name: "Cairo Governorate" },
  { id: "eg-giza", countryId: "eg", name: "Giza" },
  { id: "eg-alex", countryId: "eg", name: "Alexandria" },

  // ===========================
  // ALGERIA
  // ===========================

  { id: "dz-algiers", countryId: "dz", name: "Algiers" },
  { id: "dz-oran", countryId: "dz", name: "Oran" },
  { id: "dz-constantine", countryId: "dz", name: "Constantine" },

  // ===========================
  // MOROCCO
  // ===========================

  { id: "ma-casablanca", countryId: "ma", name: "Casablanca-Settat" },
  { id: "ma-rabat", countryId: "ma", name: "Rabat-Salé-Kénitra" },
  { id: "ma-marrakech", countryId: "ma", name: "Marrakesh-Safi" },

];
