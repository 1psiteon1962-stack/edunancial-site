export interface CountryLaunchStatus {

  country: string;

  marketplace: number;

  localization: number;

  paymentSystems: number;

  aiResearch: number;

  overallReadiness: number;

}

export function getCountryStatus(): CountryLaunchStatus[] {

  return [

    {

      country: "United States",

      marketplace: 65,

      localization: 100,

      paymentSystems: 95,

      aiResearch: 80,

      overallReadiness: 85,

    },

    {

      country: "Canada",

      marketplace: 20,

      localization: 70,

      paymentSystems: 40,

      aiResearch: 35,

      overallReadiness: 41,

    },

    {

      country: "Uganda",

      marketplace: 10,

      localization: 30,

      paymentSystems: 20,

      aiResearch: 60,

      overallReadiness: 30,

    },

    {

      country: "Nigeria",

      marketplace: 5,

      localization: 20,

      paymentSystems: 20,

      aiResearch: 55,

      overallReadiness: 25,

    },

  ];

}
