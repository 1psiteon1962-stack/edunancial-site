/**
 * Shared constants for the admin content module.
 * This file must remain free of any Node.js-only imports so it can be
 * safely imported from both server code and client components.
 */

export const CONTENT_DESTINATIONS = ["courses", "marketplace"] as const;
export const COURSE_TRACKS = ["red", "white", "blue"] as const;
export const COURSE_LEVELS = ["level-1", "level-2", "level-3", "level-4", "level-5"] as const;
export const PUBLICATION_STATES = ["draft", "review", "published", "archived"] as const;
export const MEMBERSHIP_ACCESS = ["free", "basic", "premium", "elite"] as const;
export const SUPPORTED_REGIONS = [
  "north-america",
  "latin-america",
  "caribbean",
  "europe",
  "africa",
  "asia",
  "middle-east",
  "oceania",
  "global",
] as const;
export const MARKETPLACE_CATEGORIES = [
  "books",
  "ebooks",
  "pdf-guides",
  "templates",
  "worksheets",
  "forms",
  "downloads",
  "zip-packages",
  "audio",
  "videos",
  "images",
  "software",
  "digital-products",
  "calculators",
  "presentations",
  "spreadsheets",
  "future-products",
] as const;
export const SUPPORTED_UPLOAD_LANGUAGES = ["en", "es", "fr", "fr-CA"] as const;
