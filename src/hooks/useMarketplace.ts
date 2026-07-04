"use client";

import { useLocation } from "./useLocation";

import { getMarketplace } from "@/lib/location/location-service";

export function useMarketplace() {

  const location = useLocation();

  return getMarketplace(location.countryId);

}
