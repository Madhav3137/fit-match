import { HeroSection } from "@/components/marketing/hero-section";
import { RetailerStrip } from "@/components/marketing/retailer-strip";
import { StepFlow } from "@/components/marketing/step-flow";
import { ProductPreviewDemo } from "@/components/marketing/product-preview-demo";
import { FAQSection } from "@/components/marketing/faq-section";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-[#080808]">
      {/* 1. Editorial Hero Section */}
      <HeroSection />

      {/* 2. Supported Retailers & Transparent Status */}
      <RetailerStrip />

      {/* 3. Three-movement Architectural Process */}
      <StepFlow />

      {/* 4. Live Interactive Sizing Calibration Demo */}
      <ProductPreviewDemo />

      {/* 5. Editorial CTA Section */}
      <section className="py-28 border-t border-[#202020] bg-gradient-to-b from-[#0a0a0a] to-[#080808]">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
              // INITIALIZE CALIBRATION
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
              Know Your Fit Before You Buy.
            </h2>
            <p className="text-sm sm:text-base text-[#8e8e8e] max-w-xl mx-auto">
              Construct your universal body profile in less than two minutes. Zero invasive
              tracking, zero guesswork.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/profile">
                <Button size="lg" className="w-full sm:w-auto group flex items-center gap-2">
                  <span>Create Universal Profile</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/analyze">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Paste Product Link
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Knowledge Base & FAQ */}
      <FAQSection />
    </div>
  );
}
