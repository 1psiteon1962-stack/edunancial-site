export interface PaymentProviderMap {

  country: string;

  providers: string[];

}

export const paymentProviderMap: PaymentProviderMap[] = [

  {

    country: "United States",

    providers: [

      "Square",

      "PayPal",

    ],

  },

  {

    country: "Canada",

    providers: [

      "Square",

      "PayPal",

    ],

  },

  {

    country: "Uganda",

    providers: [

      "MTN Mobile Money",

      "Sendwave",

    ],

  },

  {

    country: "Nigeria",

    providers: [

      "Flutterwave",

      "Paystack",

    ],

  },

];
