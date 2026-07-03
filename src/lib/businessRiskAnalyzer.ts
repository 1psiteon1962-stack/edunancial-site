export interface BusinessRisk {

  id: string;

  title: string;

  severity: "Low" | "Medium" | "High";

  recommendation: string;

}

export function analyzeBusinessRisk(

answers: Record<string,string>

): BusinessRisk[] {

const risks: BusinessRisk[] = [];

if (
  answers.cashflow === "Critical" ||
  answers.cashflow === "Weak"
) {

risks.push({

id: "cashflow",

title: "Cash Flow Risk",

severity: "High",

recommendation:
"Improve cash flow before attempting expansion."

});

}

if (
  answers.profitability === "No"
) {

risks.push({

id: "profit",

title: "Profitability Risk",

severity: "High",

recommendation:
"Focus on becoming profitable before pursuing financing."

});

}

if (
  answers.numbers === "Never"
) {

risks.push({

id: "kpi",

title: "KPI Risk",

severity: "High",

recommendation:
"Begin tracking business numbers every day."

});

}

if (
  answers.pricing === "Very Low"
)

risks.push({

id:"pricing",

title:"Pricing Risk",

severity:"Medium",

recommendation:
"Review pricing strategy and profit margins."

});

if (
  answers.marketing === "Referrals"
)

risks.push({

id:"marketing",

title:"Customer Acquisition Risk",

severity:"Medium",

recommendation:
"Diversify marketing channels."

});

return risks;

}
