export type MarketplaceCategory =
  | "attorney"
  | "accountant"
  | "real-estate"
  | "insurance"
  | "financial-advisor"
  | "tax"
  | "mortgage"
  | "business"
  | "banking";

export interface MarketplaceProvider {

  id: string;

  companyName: string;

  category: MarketplaceCategory;

  country: string;

  state: string;

  city: string;

  languages: string[];

  email: string;

  phone: string;

  website?: string;

  verified: boolean;

  featured: boolean;

}
