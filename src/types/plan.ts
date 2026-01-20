export type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
};

export function normalizePlan(input: any): Plan {
  return {
    id: String(input.id ?? ""),
    name: String(input.name ?? "Unnamed Plan"),
    price: Number(input.price ?? 0),
    features: Array.isArray(input.features) ? input.features : [],
  };
}
