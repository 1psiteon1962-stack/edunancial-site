export interface LocalizationStatus {

  country: string;

  language: string;

  currency: string;

  completed: boolean;

}

export function getLocalizationStatus(): LocalizationStatus[] {

  return [

    {

      country: "United States",

      language: "English",

      currency: "USD",

      completed: true,

    },

    {

      country: "Canada",

      language: "English / French",

      currency: "CAD",

      completed: false,

    },

    {

      country: "Dominican Republic",

      language: "Spanish",

      currency: "DOP",

      completed: false,

    },

    {

      country: "Spain",

      language: "Spanish",

      currency: "EUR",

      completed: false,

    },

  ];

}
