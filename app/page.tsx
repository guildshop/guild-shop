import { Metadata } from "next";
import { HeroStage } from "@/components/hero/HeroStage";
import { MarketplacePreview } from "@/components/sections/MarketplacePreview";
import { AboutSection } from "@/components/sections/AboutSection";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Guild Shop — Independent Designers / Artists",
};

export default function HomePage() {
  return (
    <>
      {/* Sci-fi video hero — panels fly in over video on scroll */}
      <HeroStage />

      {/* The rest of the page scrolls on after the hero stage releases */}
      <div style={{ position: "relative", zIndex: 1, background: "var(--color-bg)" }}>
        <MarketplacePreview />
        <AboutSection />
        <Footer />
      </div>
    </>
  );
}
