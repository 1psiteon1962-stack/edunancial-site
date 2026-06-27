import { SaleRecord } from "./salesTypes";

const STORAGE_KEY = "edunancial-sales";

export function getSales(): SaleRecord[] {

  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];

}

export function saveSale(
  sale: SaleRecord
) {

  const sales = getSales();

  sales.push(sale);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sales)
  );

}

export function totalRevenue() {

  return getSales().reduce(
    (sum, sale) => sum + sale.amount,
    0
  );

}
