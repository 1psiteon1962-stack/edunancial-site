/**
 * LATAM Currency Configuration
 *
 * Primary currencies used in Latin America and the Caribbean.
 * All currency metadata lives in the global GLOBAL_CURRENCIES registry.
 * This file declares which currencies are active in the LATAM region.
 *
 * To add a new currency: add its ISO code to LATAM_CURRENCY_CODES and
 * register it in src/lib/global/currency-framework.ts — no other changes needed.
 */

/**
 * ISO 4217 codes for currencies active in the LATAM region.
 * Ordered by economic significance.
 */
export const LATAM_CURRENCY_CODES: string[] = [
  "MXN", // Mexican Peso
  "BRL", // Brazilian Real
  "ARS", // Argentine Peso
  "COP", // Colombian Peso
  "PEN", // Peruvian Sol
  "DOP", // Dominican Peso
  "USD", // US Dollar (Panama, Ecuador, El Salvador, Puerto Rico, and others)
  "CLP", // Chilean Peso
  "UYU", // Uruguayan Peso
  "GTQ", // Guatemalan Quetzal
  "HNL", // Honduran Lempira
  "NIO", // Nicaraguan Córdoba
  "CRC", // Costa Rican Colón
  "PAB", // Panamanian Balboa (pegged to USD)
  "BZD", // Belize Dollar
  "SVC", // Salvadoran Colón (formally replaced by USD, kept for completeness)
  "BOB", // Bolivian Boliviano
  "PYG", // Paraguayan Guaraní
  "VES", // Venezuelan Bolívar
  "TTD", // Trinidad and Tobago Dollar
  "JMD", // Jamaican Dollar
  "HTG", // Haitian Gourde
  "SRD", // Surinamese Dollar
  "GYD", // Guyanese Dollar
  "CUP", // Cuban Peso
];

/** Default regional currency for LATAM pricing display */
export const LATAM_DEFAULT_CURRENCY = "USD";
