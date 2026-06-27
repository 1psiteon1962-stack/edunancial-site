export interface SaleRecord {

  id: string;

  customerName: string;

  customerEmail: string;

  productId: string;

  productName: string;

  category: "book" | "terms" | "course" | "membership";

  amount: number;

  quantity: number;

  squareTransactionId: string;

  purchaseDate: string;

  downloadGranted: boolean;

}

export interface MonthlyRevenue {

  month: string;

  revenue: number;

}
