// Canonical barrel — supports BOTH lowercase and PascalCase imports
// Matches your lowercase filesystem AND existing page imports

import HeroSection from './herosection';
import AppsSection from './appssection';
import CoursesSection from './coursessection';
import StorySection from './storysection';
import RotatingVideoSection from './rotatingvideosection';
import FooterSection from './footersection';

// PascalCase exports (for sane future imports)
export {
  HeroSection,
  AppsSection,
  CoursesSection,
  StorySection,
  RotatingVideoSection,
  FooterSection,
};

// lowercase exports (to satisfy EXISTING imports in pages/layouts)
export const herosection = HeroSection;
export const appssection = AppsSection;
export const coursessection = CoursesSection;
export const storysection = StorySection;
export const rotatingvideosection = RotatingVideoSection;
export const footersection = FooterSection;
