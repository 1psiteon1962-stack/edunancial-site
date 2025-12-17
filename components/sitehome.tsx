import {
  HeroSection,
  StorySection,
  AppsSection,
  BooksSection,
  CoursesSection,
  RotatingVideoSection,
  FooterSection,
} from './sections';

import siteConfig from '../data/site-config';

export default function SiteHome() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <AppsSection />
      <BooksSection />
      <CoursesSection />
      <RotatingVideoSection />
      <FooterSection />
    </main>
  );
}
