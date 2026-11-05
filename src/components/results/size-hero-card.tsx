"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { RecommendationResult } from "@/lib/sizing/types";
import { ProductExtractionResult } from "@/lib/retailers/types";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

interface SizeHeroCardProps {
  product: ProductExtractionResult;
  recommendation: RecommendationResult;
  fitPreference?: string;
}

export function SizeHeroCard({
  product,
  recommendation,
  fitPreference = "regular",
}: SizeHeroCardProps) {
  const isNoMatch = recommendation.status === "no_match";
  const isLowConfidence = recommendation.status === "low_confidence";

  const getStatusIcon = () => {
    if (isNoMatch) return <XCircle className="w-4 h-4 text-red-400" />;
    if (isLowConfidence) return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  };

  const getStatusLabel = () => {
    if (isNoMatch) return "DIMENSIONAL MISMATCH";
    if (isLowConfidence) return "LOW CONFIDENCE MATCH";
    return "VERIFIED RECOMMENDATION";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: TRANSITION_EASE }}
      className="p-8 sm:p-10 rounded-3xl border border-[#303030] bg-[#101010] relative overflow-hidden space-y-8"
    >
      {/* Top Metadata Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#202020] gap-3">
        <div className="flex items-center gap-2.5">
          {getStatusIcon()}
          <span className="text-[11px] font-mono tracking-technical text-white uppercase font-semibold">
            {getStatusLabel()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={recommendation.confidence === "high" ? "active" : "beta"}>
            {recommendation.confidence.toUpperCase()} CONFIDENCE
          </Badge>
          <Badge variant="outline">
            FIT: {fitPreference.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Dominant Recommended Size Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6 space-y-2">
          <span className="text-[11px] font-mono tracking-technical text-[#888] uppercase block">
            {isNoMatch ? "CLOSEST CANDIDATE" : "RECOMMENDED SIZE"}
          </span>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: TRANSITION_EASE }}
            className="text-7xl sm:text-9xl font-bold font-mono tracking-tighter text-white"
          >
            {recommendation.recommendedSize || "—"}
          </motion.div>

          {isNoMatch && (
            <p className="text-xs text-red-300 font-mono mt-1">
              Your body measurements exceed the available chart ranges for this item.
            </p>
          )}
        </div>

        {/* Product Identity Column */}
        <div className="md:col-span-6 space-y-4 md:border-l md:border-[#202020] md:pl-8">
          <div>
            <span className="text-xs font-mono text-[#888] uppercase tracking-wider block">
              {product.brand || product.retailer}
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {product.title || "Garment Item"}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs font-mono text-[#666]">
              <span className="uppercase">{product.category || "Apparel"}</span>
              <span>•</span>
              <span className="uppercase">{product.domain || "Retailer Source"}</span>
            </div>
          </div>

          {/* Structured Primary Reasons */}
          <div className="pt-3 border-t border-[#1c1c1c] space-y-2">
            {recommendation.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#ccc] leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Provenance Notice */}
      <div className="pt-6 border-t border-[#1c1c1c] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-[#666] gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#888]" />
          <span>CHART SOURCE: {recommendation.chartSource.toUpperCase()}</span>
        </div>
        <span>NON-FABRICATED CALCULATION</span>
      </div>
    </motion.div>
  );
}

