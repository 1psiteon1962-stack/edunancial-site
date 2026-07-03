export interface KPI {

  id: string;

  name: string;

  description: string;

  category: string;

  importance: number;

}

export const businessKPIs: KPI[] = [

{
id: "grossRevenue",
name: "Gross Revenue",
category: "Financial",
importance: 10,
description: "Total income before expenses."
},

{
id: "netProfit",
name: "Net Profit",
category: "Financial",
importance: 10,
description: "Money remaining after all expenses."
},

{
id: "grossMargin",
name: "Gross Margin",
category: "Financial",
importance: 10,
description: "Profit remaining after direct costs."
},

{
id: "cashFlow",
name: "Cash Flow",
category: "Financial",
importance: 10,
description: "Cash entering and leaving the business."
},

{
id: "operatingMargin",
name: "Operating Margin",
category: "Financial",
importance: 9,
description: "Operating profit percentage."
},

{
id: "accountsReceivable",
name: "Accounts Receivable",
category: "Financial",
importance: 8,
description: "Money owed to the business."
},

{
id: "accountsPayable",
name: "Accounts Payable",
category: "Financial",
importance: 8,
description: "Money the business owes."
},

{
id: "averageSale",
name: "Average Sale",
category: "Sales",
importance: 9,
description: "Average revenue per transaction."
},

{
id: "conversionRate",
name: "Conversion Rate",
category: "Marketing",
importance: 9,
description: "Percentage of prospects becoming customers."
},

{
id: "customerLifetimeValue",
name: "Customer Lifetime Value",
category: "Marketing",
importance: 10,
description: "Expected lifetime revenue from one customer."
},

{
id: "customerAcquisitionCost",
name: "Customer Acquisition Cost",
category: "Marketing",
importance: 10,
description: "Cost required to acquire one customer."
},

{
id: "employeeProductivity",
name: "Employee Productivity",
category: "Operations",
importance: 8,
description: "Revenue generated per employee."
},

{
id: "inventoryTurnover",
name: "Inventory Turnover",
category: "Operations",
importance: 8,
description: "How quickly inventory sells."
},

{
id: "monthlyGrowthRate",
name: "Monthly Growth Rate",
category: "Growth",
importance: 9,
description: "Business growth month over month."
}

];
