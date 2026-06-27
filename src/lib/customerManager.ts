import { Customer } from "./customerTypes";

const STORAGE_KEY = "edunancial-customers";

export function getCustomers(): Customer[] {

  if (typeof window === "undefined")
    return [];

  const value =
    localStorage.getItem(STORAGE_KEY);

  return value
    ? JSON.parse(value)
    : [];

}

export function saveCustomer(
  customer: Customer
) {

  const customers = getCustomers();

  customers.push(customer);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(customers)
  );

}

export function customerCount() {

  return getCustomers().length;

}
