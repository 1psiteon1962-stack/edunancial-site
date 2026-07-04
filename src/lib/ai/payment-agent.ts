export interface PaymentHealth {

  provider: string;

  status: string;

  successRate: number;

  failedTransactions: number;

}

export function getPaymentHealth(): PaymentHealth[] {

  return [

    {

      provider: "Square",

      status: "Ready",

      successRate: 100,

      failedTransactions: 0,

    },

    {

      provider: "PayPal",

      status: "Planned",

      successRate: 0,

      failedTransactions: 0,

    },

    {

      provider: "Flutterwave",

      status: "Planned",

      successRate: 0,

      failedTransactions: 0,

    },

  ];

}
