import Hero from "@/components/Hero/Hero";
import FeatureGrid from "@/components/FeatureGrid/FeatureGrid";
import CTA from "@/components/CTA/CTA";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeatureGrid />
      <CTA />
      <Footer />
    </>
  );
}
