"use client";

import { useI18nContext } from "./context";

export function useI18n() {
  return useI18nContext();
}

export function useLocale() {
  return useI18nContext().locale;
}
