/**
 * Unified Square Payment Link API
 *
 * This is the single, catalog-driven checkout endpoint.  It replaces
 * product-specific checkout routes: any purchasable item — membership,
 * course, book, event, certification, donation — goes through this one
 * handler.
 *
 * Request body:
 *   itemId      string   Required — catalog item ID (or legacy membership plan ID)
 *   discountCode  string   Optional — promotional/discount code
 *   customerEmail string   Optional — pre-fills the Square checkout email field
 *
 * Response (success):
 *   { success: true, checkoutUrl: "https://squareup.com/…", itemId, planId