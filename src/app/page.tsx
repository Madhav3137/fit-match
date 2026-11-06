import { HeroSection } from "@/components/marketing/hero-section";
import { RetailerStrip } from "@/components/marketing/retailer-strip";
import { StepFlow } from "@/components/marketing/step-flow";
import { ProductPreviewDemo } from "@/components/marketing/product-preview-demo";
import { FAQSection } from "@/components/marketing/faq-section";
import { ClosingCTA } from "@/components/marketing/closing-cta";
import { ScrollDivider } from "@/components/motion/scroll-divider";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-transparent">
      {/* 1. Editorial Hero Section */}
      <HeroSection />

      <ScrollDivider />

      {/* 2. Supported Retailers & Transparent Status */}
      <RetailerStrip />

      <ScrollDivider />

      {/* 3. Three-movement Architectural Process */}
      <StepFlow />

      <ScrollDivider />

      {/* 4. Live Interactive Sizing Calibration Demo */}
      <ProductPreviewDemo />

      <ScrollDivider />

      {/* 5. Technical Knowledge Base & FAQ */}
      <FAQSection />

      <ScrollDivider />

      {/* 6. Grand Finale Closing Chapter: YOUR NEXT PURCHASE. A BETTER FIT. */}
      <ClosingCTA />
    </div>
  );
}
