export interface Customer {

  id: string;

  firstName: string;

  lastName: string;

  email: string;

  country: string;

  memberSince: string;

  membershipType:
    | "Free"
    | "Basic"
    | "Premium";

  totalPurchases: number;

  totalSpent: number;

  active: boolean;

}

export interface CustomerActivity {

  customerId: string;

  lastLogin: string;

  downloads: number;

  booksOwned: number;

  termPacksOwned: number;

  coursesOwned: number;

}
