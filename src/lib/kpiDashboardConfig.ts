export interface DashboardWidget {

  id: string;

  title: string;

  enabled: boolean;

}

export const EXECUTIVE_DASHBOARD: DashboardWidget[] = [

  { id: "grossRevenue", title: "Gross Revenue", enabled: true },

  { id: "netRevenue", title: "Net Revenue", enabled: true },

  { id: "grossProfit", title: "Gross Profit", enabled: true },

  { id: "netProfit", title: "Net Profit", enabled: true },

  { id: "profitMargin", title: "Profit Margin", enabled: true },

  { id: "subscriptions", title: "Subscriptions", enabled: true },

  { id: "ebooks", title: "eBook Sales", enabled: true },

  { id: "courses", title: "Course Sales", enabled: true },

  { id: "downloads", title: "Downloads", enabled: true },

  { id: "conversionRate", title: "Conversion Rate", enabled: true },

  { id: "customerLifetimeValue", title: "Customer Lifetime Value", enabled: true },

  { id: "averageOrderValue", title: "Average Order Value", enabled: true }

];
