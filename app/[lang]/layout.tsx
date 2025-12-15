import {
  HeroSection,
  AppsSection,
  CoursesSection,
  StorySection,
  RotatingVideoSection,
  FooterSection,
} from "@/components/sections";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HeroSection />
        <AppsSection />
        <CoursesSection />
        <StorySection />
        <RotatingVideoSection />
        <FooterSection />
        {children}
      </body>
    </html>
  );
}
