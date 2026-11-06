import { HeroSection } from "@/components/marketing/hero-section";
import { RetailerStrip } from "@/components/marketing/retailer-strip";
import { Chapter01Profile } from "@/components/marketing/chapter-01-profile";
import { Chapter02Scanner } from "@/components/marketing/chapter-02-scanner";
import { Chapter03Synthesis } from "@/components/marketing/chapter-03-synthesis";
import { FAQSection } from "@/components/marketing/faq-section";
import { ClosingCTA } from "@/components/marketing/closing-cta";
import { ScrollDivider } from "@/components/motion/scroll-divider";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-transparent">
      {/* 1. Dramatic Editorial Hero Section with 3D Holographic Model */}
      <HeroSection />

      <ScrollDivider />

      {/* 2. Visual Experimentation Retailer Section with Kinetic Marquee */}
      <RetailerStrip />

      <ScrollDivider />

      {/* 3. Chapter 01: Universal Body Profile Lab & 3D Interactive Mannequin */}
      <Chapter01Profile />

      <ScrollDivider />

      {/* 4. Chapter 02: Garment Link Ingestion & Laser Silhouette Scanner */}
      <Chapter02Scanner />

      <ScrollDivider />

      {/* 5. Chapter 03: Fit Synthesis, Ease Mapping & Recommendation Reveal */}
      <Chapter03Synthesis />

      <ScrollDivider />

      {/* 6. Technical Knowledge Base & FAQ */}
      <FAQSection />

      {/* 7. Grand Finale Closing Chapter (Transitions directly into Footer) */}
      <ClosingCTA />
    </div>
  );
}
