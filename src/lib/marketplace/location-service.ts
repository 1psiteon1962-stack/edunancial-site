export interface UserLocation {

  country: string;

  state: string;

  city: string;

  currency: string;

  language: string;

}

export function getDefaultLocation(): UserLocation {

  return {

    country: "United States",

    state: "California",

    city: "Los Angeles",

    currency: "USD",

    language: "English",

  };

}
