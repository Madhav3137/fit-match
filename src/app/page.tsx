import { HeroSection } from "@/components/marketing/hero-section";
import { RetailerStrip } from "@/components/marketing/retailer-strip";
import { StepFlow } from "@/components/marketing/step-flow";
import { ProductPreviewDemo } from "@/components/marketing/product-preview-demo";
import { FAQSection } from "@/components/marketing/faq-section";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ScrollDivider } from "@/components/motion/scroll-divider";
import { Magnetic } from "@/components/motion/magnetic-button";
import { MaskedHeading } from "@/components/motion/masked-text";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

      {/* 5. Editorial CTA Section with Masked Heading & Magnetic Button */}
      <section className="py-24 sm:py-32 bg-transparent relative overflow-hidden">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
              // INITIALIZE CALIBRATION
            </div>

            <MaskedHeading
              as="h2"
              className="font-display text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white uppercase leading-tight justify-center"
            >
              Know Your Fit Before You Buy.
            </MaskedHeading>

            <p className="text-sm sm:text-base text-[#8e8e8e] max-w-xl mx-auto leading-relaxed">
              Construct your universal body profile in less than two minutes. Zero invasive
              tracking, zero guesswork.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Magnetic strength={0.3}>
                <Link href="/profile">
                  <Button size="lg" className="w-full sm:w-auto group flex items-center gap-2">
                    <span>Create Universal Profile</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </Magnetic>

              <Magnetic strength={0.2}>
                <Link href="/analyze">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Paste Product Link
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </Container>
      </section>

      <ScrollDivider />

      {/* 6. Knowledge Base & FAQ */}
      <FAQSection />
    </div>
  );
}
