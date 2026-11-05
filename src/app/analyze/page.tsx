"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { StageScanner } from "@/components/analyzer/stage-scanner";
import { ProductPreviewCard } from "@/components/analyzer/product-preview-card";
import { ManualChartDrawer } from "@/components/analyzer/manual-chart-drawer";
import { ArrowLeft, ArrowRight, Link2, ShieldAlert, Sparkles } from "lucide-react";
import { getStoredProfile } from "@/lib/storage/profile-storage";
import { ProductExtractionResult, ChartExtractionResult } from "@/lib/retailers/types";

const SCAN_STAGES = [
  "Validating product link & SSRF security checks",
  "Identifying retailer adapter",
  "Reading product metadata & OpenGraph tags",
  "Evaluating size chart availability",
  "Ready for measurement matching",
];

export default function AnalyzePage() {
  const [url, setUrl] = React.useState<string>("");
  const [isScanning, setIsScanning] = React.useState<boolean>(false);
  const [scanStep, setScanStep] = React.useState<number>(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [extractedProduct, setExtractedProduct] = React.useState<ProductExtractionResult | null>(null);
  const [extractedChart, setExtractedChart] = React.useState<ChartExtractionResult | null>(null);
  const [analysisId, setAnalysisId] = React.useState<string | null>(null);

  const [showManualModal, setShowManualModal] = React.useState<boolean>(false);
  const [hasProfile, setHasProfile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const p = getStoredProfile();
    setHasProfile(!!p);
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsScanning(true);
    setScanStep(1);
    setErrorMessage(null);
    setExtractedProduct(null);
    setExtractedChart(null);

    // Choreographed stage progress
    const t1 = setTimeout(() => setScanStep(2), 600);
    const t2 = setTimeout(() => setScanStep(3), 1200);

    try {
      const storedProf = getStoredProfile();
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          profileData: storedProf || undefined,
          fitPreference: storedProf?.fitPreference || "regular",
        }),
      });

      const data = await res.json();
      setScanStep(4);

      if (!res.ok) {
        setIsScanning(false);
        setErrorMessage(data.error?.message || "Failed to analyze product URL.");
        if (data.product) {
          setExtractedProduct({
            status: "partial",
            retailer: data.product.brand || "Retailer",
            domain: data.product.domain || "",
            evidence: [],
            warnings: [data.error?.message || "Could not retrieve page."],
          });
        }
        return;
      }

      setExtractedProduct(data.product);
      setExtractedChart(data.chart);
      setAnalysisId(data.analysisId);
      setScanStep(5);
    } catch (err: any) {
      setErrorMessage("Network error: " + err.message);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setTimeout(() => {
        setIsScanning(false);
      }, 700);
    }
  };

  const handleQuickPaste = (sampleUrl: string) => {
    setUrl(sampleUrl);
  };

  const handleManualChartApplied = (manualResult: any) => {
    setExtractedProduct(manualResult.product);
    setExtractedChart(manualResult.chart);
    setAnalysisId(manualResult.analysisId);
  };

  return (
    <div className="flex-1 pt-32 pb-24 bg-[#080808]">
      <Container>
        {/* Navigation & Breadcrumb Header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#202020]">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#888] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>EDIT SIZE PROFILE</span>
          </Link>

          {!hasProfile && (
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>GUEST MODE: PROFILE NOT YET SAVED</span>
            </div>
          )}
        </div>

        {/* Page Title & Explanation */}
        <div className="max-w-2xl mb-10 space-y-2">
          <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
            // PRODUCT URL INGESTION
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
            Analyze Garment Link
          </h1>
          <p className="text-sm text-[#8e8e8e] leading-relaxed">
            Paste any clothing link. FITMATCH verifies security, identifies retailer schemas, and
            extracts product metadata without saving arbitrary web tracking cookies.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="max-w-3xl space-y-8">
          {/* URL Form Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#2e2e2e] bg-[#111111] space-y-6">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <label htmlFor="product-url" className="text-xs font-mono tracking-technical uppercase text-[#888] block">
                Product URL (HTTPS Required)
              </label>

              <div className="relative flex flex-col sm:flex-row items-stretch gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#666]">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    id="product-url"
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.zara.com/... or https://www2.hm.com/..."
                    className="w-full bg-[#161616] border border-[#303030] text-white pl-10 pr-4 py-3 rounded-xl font-mono text-sm focus:border-white focus:outline-none transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isScanning || !url.trim()}
                  size="md"
                  className="sm:min-w-[140px]"
                >
                  {isScanning ? "Scanning..." : "Inspect Product"}
                </Button>
              </div>

              {/* Quick Sample Links */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-[#666]">
                <span>Sample links:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickPaste(
                      "https://www.zara.com/us/en/heavyweight-relaxed-tee-p00722401.html"
                    )
                  }
                  className="text-neutral-400 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Zara Boxy Tee
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickPaste(
                      "https://www2.hm.com/en_us/productpage.1189333001.html"
                    )
                  }
                  className="text-neutral-400 hover:text-white underline underline-offset-2 transition-colors"
                >
                  H&M Relaxed Chino
                </button>
              </div>
            </form>
          </div>

          {/* Scanner Progress Animation */}
          {isScanning && (
            <StageScanner currentStep={scanStep} stages={SCAN_STAGES} />
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl border border-red-900/60 bg-red-950/20 text-red-300 text-xs font-mono flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block text-red-200 uppercase">Analysis Interrupted</span>
                <p>{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => setShowManualModal(true)}
                  className="text-white underline underline-offset-2 hover:text-neutral-300 font-semibold pt-1 block"
                >
                  Switch to Manual Sizing Chart Entry →
                </button>
              </div>
            </div>
          )}

          {/* Extracted Product Preview Card */}
          {extractedProduct && (
            <div className="space-y-6">
              <ProductPreviewCard
                product={extractedProduct}
                chart={extractedChart || undefined}
                onOpenManualModal={() => setShowManualModal(true)}
              />

              {/* Ready to Match CTA */}
              <div className="p-6 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Metadata & Sizing Chart Ready</span>
                  </div>
                  <p className="text-xs text-[#888] font-mono mt-0.5">
                    Execute mathematical range-penalty engine to determine best fit.
                  </p>
                </div>

                <Link href={analysisId ? `/result/${analysisId}` : "/#demo"}>
                  <Button size="md" className="flex items-center gap-2 whitespace-nowrap">
                    <span>Calculate Fit</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Manual Chart Modal Drawer */}
        <ManualChartDrawer
          isOpen={showManualModal}
          onClose={() => setShowManualModal(false)}
          productTitle={extractedProduct?.title || "Custom Garment"}
          brand={extractedProduct?.brand || "Brand"}
          initialCategory={extractedProduct?.category || "top"}
          onChartSubmitted={handleManualChartApplied}
        />
      </Container>
    </div>
  );
}
