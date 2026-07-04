export interface CEODashboard {

  topPriority: string;

  biggestRisk: string;

  biggestOpportunity: string;

  recommendedDecision: string;

}

export function getCEODashboard(): CEODashboard {

  return {

    topPriority:
      "Increase recurring membership revenue.",

    biggestRisk:
      "No critical risks reported.",

    biggestOpportunity:
      "Expand memberships into additional countries.",

    recommendedDecision:
      "Continue developing the membership platform.",

  };

}
