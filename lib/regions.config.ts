// lib/regionConfig.ts

import type { Language } from "./languageSelectors";

export interface RegionConfig {
  /** Human-readable region name */
  name: string;

  /** Supported languages for this region */
  languages: readonly Language[];

  /** Default language when none is provided or invalid */
  defaultLanguage: Language;

  /** Optional metadata */
  currency?: string;
  timezone?: string;
}
