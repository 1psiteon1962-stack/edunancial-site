export interface MarketplaceGrowth {

  country: string;

  professionalsTarget: number;

  professionalsRegistered: number;

}

export function getMarketplaceGrowth(): MarketplaceGrowth[] {

  return [

    {

      country: "United States",

      professionalsTarget: 5000,

      professionalsRegistered: 0,

    },

    {

      country: "Canada",

      professionalsTarget: 1000,

      professionalsRegistered: 0,

    },

    {

      country: "Nigeria",

      professionalsTarget: 1000,

      professionalsRegistered: 0,

    },

    {

      country: "Uganda",

      professionalsTarget: 500,

      professionalsRegistered: 0,

    },

  ];

}
