"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { SizeHeroCard } from "@/components/results/size-hero-card";
import { FitBreakdownBars } from "@/components/results/fit-breakdown-bars";
import { AlternativesList } from "@/components/results/alternatives-list";
import { ArrowLeft, RefreshCw, BookmarkCheck, LayoutDashboard, AlertCircle } from "lucide-react";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params?.analysisId as string;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [analysis, setAnalysis] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSavedToDash, setIsSavedToDash] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!analysisId) return;

    async function loadAnalysis() {
      try {
        const res = await fetch(`/api/analysis/${analysisId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error?.message || "Could not retrieve analysis details.");
        } else {
          setAnalysis(data);
        }
      } catch (err: any) {
        setError("Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [analysisId]);

  const handleSaveToDashboard = () => {
    setIsSavedToDash(true);
    // Persist to local recent history list if needed
    try {
      const existingHistory = JSON.parse(localStorage.getItem("fitmatch_recent_analyses") || "[]");
      if (!existingHistory.some((item: any) => item.analysisId === analysis.analysisId)) {
        existingHistory.unshift({
          analysisId: analysis.analysisId,
          title: analysis.product?.title || "Apparel Item",
          brand: analysis.product?.brand || "Brand",
          recommendedSize: analysis.recommendation?.recommendedSize || "—",
          confidence: analysis.recommendation?.confidence || "medium",
          date: new Date().toLocaleDateString(),
        });
        localStorage.setItem("fitmatch_recent_analyses", JSON.stringify(existingHistory.slice(0, 10)));
      }
    } catch (e) {
      console.warn("Storage sync skipped", e);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 pt-32 pb-24 bg-[#080808]">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="h-6 w-48 bg-[#181818] rounded" />
            <div className="h-80 w-full bg-[#121212] rounded-3xl border border-[#222]" />
            <div className="h-48 w-full bg-[#121212] rounded-3xl border border-[#222]" />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !analysis || !analysis.recommendation) {
    return (
      <div className="flex-1 pt-32 pb-24 bg-[#080808]">
        <Container>
          <div className="max-w-xl mx-auto text-center space-y-6">
            <div className="p-4 rounded-full bg-red-950/40 border border-red-900/60 inline-flex text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold uppercase text-white">
              Analysis Record Unavailable
            </h1>
            <p className="text-xs text-[#888] leading-relaxed">
              {error || "The requested analysis record does not contain active recommendation results."}
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link href="/analyze">
                <Button size="md">Try Product Link Again</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="md">Review Profile</Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const { product, recommendation } = analysis;

  return (
    <div className="flex-1 pt-32 pb-24 bg-[#080808]">
      <Container>
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[#202020] gap-4">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#888] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ANALYZE ANOTHER GARMENT</span>
            </Link>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveToDashboard}
                disabled={isSavedToDash}
                className="flex items-center gap-2"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>{isSavedToDash ? "Saved to History" : "Save Analysis"}</span>
              </Button>
              <Link href="/dashboard">
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* 1. Dominant Recommended Size Hero Card */}
          <SizeHeroCard
            product={product}
            recommendation={recommendation}
          />

          {/* 2. Dimensional Metric Comparison Bars */}
          <FitBreakdownBars breakdowns={recommendation.fitBreakdown} />

          {/* 3. Alternative Candidate Sizes & Trade-Offs */}
          <AlternativesList alternatives={recommendation.alternatives} />

          {/* 4. Integrity & Fit Disclaimer */}
          <div className="p-6 rounded-2xl border border-[#222] bg-[#0c0c0c] text-xs text-[#707070] font-mono leading-relaxed space-y-1">
            <span className="text-white uppercase font-bold block">
              Algorithmic Fit Notice:
            </span>
            <p>{recommendation.disclaimer}</p>
          </div>

          {/* 5. Bottom Navigation Action */}
          <div className="pt-6 border-t border-[#202020] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/profile" className="text-xs font-mono text-[#888] hover:text-white transition-colors">
              Need to adjust your measurements? Edit Profile →
            </Link>

            <Link href="/analyze">
              <Button size="lg" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Analyze New Link</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
