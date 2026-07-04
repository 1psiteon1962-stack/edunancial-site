export interface OperationsStatus {

  websiteStatus: string;

  marketplaceStatus: string;

  paymentStatus: string;

  aiSystemsStatus: string;

}

export function getOperationsStatus(): OperationsStatus {

  return {

    websiteStatus: "Operational",

    marketplaceStatus: "Development",

    paymentStatus: "Square Integration",

    aiSystemsStatus: "Planning",

  };

}
