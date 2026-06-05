import { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedDesigners } from "@/components/designers/FeaturedDesigners";
import { MarketplacePreview } from "@/components/sections/MarketplacePreview";
import { AboutSection } from "@/components/sections/AboutSection";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Guild Shop — Independent Designers / Artists",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDesigners />
      <MarketplacePreview />
      <AboutSection />
      <Footer />
    </>
  );
}
