'use client';

import dynamic from "next/dynamic";
import React from "react";

/*
STATIC SECTION IMPORT REGISTRY

Next.js requires all client modules to be statically analyzable.
DO NOT use dynamic template paths like:

dynamic(() => import(`@/components/sections/${section.component}`))

Every section must be explicitly declared here.
*/

const sectionComponents = {
  hero: dynamic(() => import("@/components/sections/Hero")),
  testimonial: dynamic(() => import("@/components/sections/Testimonial")),
  features: dynamic(() => import("@/components/sections/Features")),
  pricing: dynamic(() => import("@/components/sections/Pricing")),
  faq: dynamic(() => import("@/components/sections/FAQ")),
  cta: dynamic(() => import("@/components/sections/CTA")),
  slider: dynamic(() => import("@/components/sections/Slider")),
} satisfies Record<string, React.ComponentType<any>>;

interface SectionData {
  component: keyof typeof sectionComponents;
  props?: Record<string, any>;
}

interface RendererProps {
  section: SectionData;
}

export default function SectionRenderer({ section }: RendererProps) {
  const Section = sectionComponents[section.component];

  if (!Section) {
    throw new Error(`Unsupported section type: ${section.component}`);
  }

  return <Section {...(section.props || {})} />;
}
