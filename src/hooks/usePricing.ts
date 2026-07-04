"use client";

import { useLocation } from "./useLocation";

import { getPricing } from "@/lib/location/location-service";

export function usePricing() {

  const location = useLocation();

  return getPricing(location.countryId);

}
