import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AnalyzePage() {
  return (
    <div className="flex-1 pt-32 pb-24 bg-[#080808]">
      <Container>
        <div className="max-w-2xl mx-auto space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#888] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO OVERVIEW</span>
          </Link>

          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
              // PRODUCT INGESTION // PHASE 3 STAGING
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
              Analyze Product URL
            </h1>
            <p className="text-xs text-[#888] leading-relaxed">
              Server-side SSRF-protected URL parser and retailer adapter pipeline staged for Phase 3.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#262626] bg-[#0f0f0f] text-center space-y-4">
            <span className="text-xs font-mono text-neutral-400">
              Live URL submission, stage scanner, and manual fallback modal will initialize here.
            </span>
            <div>
              <Link href="/#demo">
                <Button variant="secondary" size="sm">
                  Test Sizing Calibration in Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
