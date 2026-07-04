"use client";

import { useEffect, useState } from "react";

import { getDefaultLocation } from "@/lib/location/geolocation";

export function useLocation() {

  const [location, setLocation] =
    useState(getDefaultLocation());

  useEffect(() => {

    // Future:
    // Detect visitor location from API.

  }, []);

  return location;

}
