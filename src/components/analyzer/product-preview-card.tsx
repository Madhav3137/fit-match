"use client";

import { ProductExtractionResult, ChartExtractionResult } from "@/lib/retailers/types";
import { Badge } from "../ui/badge";
import { AlertCircle, Tag, CheckCircle2 } from "lucide-react";

interface ProductPreviewCardProps {
  product: ProductExtractionResult;
  chart?: ChartExtractionResult;
  onOpenManualModal?: () => void;
}

export function ProductPreviewCard({
  product,
  chart,
  onOpenManualModal,
}: ProductPreviewCardProps) {
  const needsManualChart = !chart || chart.status === "manual_required" || chart.status === "not_found";

  return (
    <div className="rounded-2xl border border-[#303030] bg-[#111111] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#222]">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-[#888]" />
          <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase">
            PRODUCT METADATA EXTRACTED
          </span>
        </div>
        <Badge variant={product.status === "success" ? "active" : "beta"}>
          {product.retailer}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Product Image / Line-Art Placeholder */}
        <div className="md:col-span-4 aspect-square rounded-xl border border-[#242424] bg-[#0c0c0c] flex items-center justify-center overflow-hidden relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title || "Garment product"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <svg
                viewBox="0 0 100 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-20 text-[#444]"
              >
                {/* Garment Line-art icon */}
                <path
                  d="M 30 20 L 40 28 L 60 28 L 70 20 L 88 38 L 74 50 L 74 100 L 26 100 L 26 50 L 12 38 Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[10px] font-mono text-[#555] mt-2 uppercase">
                {product.category || "GARMENT"}
              </span>
            </div>
          )}
        </div>

        {/* Product Metadata Info */}
        <div className="md:col-span-8 space-y-4">
          <div>
            <span className="text-[11px] font-mono text-[#666] uppercase block">
              {product.brand || product.retailer}
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
              {product.title || "Unnamed Apparel"}
            </h3>
            {product.description && (
              <p className="text-xs text-[#888] line-clamp-2 mt-1.5 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg border border-[#222] bg-[#161616]">
              <span className="text-[10px] text-[#666] block uppercase">Category</span>
              <span className="text-white font-medium uppercase">
                {product.category || "Other"}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-[#222] bg-[#161616]">
              <span className="text-[10px] text-[#666] block uppercase">Chart Status</span>
              <span
                className={`text-xs font-medium uppercase ${
                  needsManualChart ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {needsManualChart ? "MANUAL ENTRY" : "VERIFIED"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Status Banner */}
      {needsManualChart ? (
        <div className="p-4 rounded-xl border border-amber-900/40 bg-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <span className="font-semibold block text-amber-300">
                Size Chart Requires Confirmation
              </span>
              Retailer size data is served via dynamic dialogs. Confirm or supply size table
              measurements below to proceed with mathematical recommendation.
            </div>
          </div>
          {onOpenManualModal && (
            <button
              type="button"
              onClick={onOpenManualModal}
              className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 shrink-0 transition-colors"
            >
              Configure Chart
            </button>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-xl border border-emerald-900/40 bg-emerald-950/20 flex items-center gap-2 text-xs text-emerald-300 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Product-specific size dimensions successfully resolved from retailer feed.</span>
        </div>
      )}
    </div>
  );
}

