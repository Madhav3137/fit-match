import { HeroSection } from "@/components/marketing/hero-section";
import { RetailerStrip } from "@/components/marketing/retailer-strip";
import { StepFlowPinned } from "@/components/marketing/step-flow-pinned";
import { ProductPreviewDemo } from "@/components/marketing/product-preview-demo";
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

      {/* 3. Full-Screen Pinned Storytelling Operational Flow */}
      <StepFlowPinned />

      <ScrollDivider />

      {/* 4. Live Sizing Laboratory Calibration Terminal */}
      <ProductPreviewDemo />

      <ScrollDivider />

      {/* 5. Technical Knowledge Base & FAQ */}
      <FAQSection />

      {/* 6. Grand Finale Closing Chapter (Transitions directly into Footer) */}
      <ClosingCTA />
    </div>
  );
}
