// lib/content-resolver.ts

import { resolveRegion, Region } from "./regions"

export type PageContent = {
  heroTitle: string
  heroSubtitle: string
}

const africaContent: PageContent = {
  heroTitle: "Africa",
  heroSubtitle: "Entrepreneurship and opportunity across Africa",
}

const asiaContent: PageContent = {
  heroTitle: "Asia",
  heroSubtitle: "Growth, technology, and markets in Asia",
}

const europeContent: PageContent = {
  heroTitle: "Europe",
  heroSubtitle: "Innovation and regulation-aware growth in Europe",
}

const northAmericaContent: PageContent = {
  heroTitle: "North America",
  heroSubtitle: "Capital, scale, and systems in North America",
}

const southAmericaContent: PageContent = {
  heroTitle: "South America",
  heroSubtitle: "Emerging markets and cross-border growth in South America",
}

const oceaniaContent: PageContent = {
  heroTitle: "Oceania",
  heroSubtitle: "Island economies and modern infrastructure",
}

const defaultContent: PageContent = {
  heroTitle: "Global",
  heroSubtitle: "Building systems that scale worldwide",
}

export function resolvePageContent(regionInput?: string): PageContent {
  const region: Region = resolveRegion(regionInput)

  switch (region.code) {
    case "AF":
      return africaContent
    case "AS":
      return asiaContent
    case "EU":
      return europeContent
    case "US":
    case "NA":
      return northAmericaContent
    case "SA":
      return southAmericaContent
    case "OC":
      return oceaniaContent
    default:
      return defaultContent
  }
}
