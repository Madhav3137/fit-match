"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

export interface ScanStage {
  step: number;
  label: string;
  status: "pending" | "active" | "completed" | "failed";
}

interface StageScannerProps {
  currentStep: number;
  stages: string[];
}

export function StageScanner({ currentStep, stages }: StageScannerProps) {
  return (
    <div className="p-6 rounded-2xl border border-[#2e2e2e] bg-[#0d0d0d] relative overflow-hidden space-y-5">
      {/* Laser Scanning Line Motif */}
      <motion.div
        animate={{ y: ["0%", "280%", "0%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
      />

      <div className="flex items-center justify-between pb-3 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase">
            SERVER EVALUATION IN PROGRESS
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#555]">
          HTTPS // SSRF PROTECTED
        </span>
      </div>

      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <div
              key={stage}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                isCurrent
                  ? "border-neutral-500 bg-[#161616] text-white"
                  : isDone
                  ? "border-[#222] bg-[#101010] text-neutral-400"
                  : "border-transparent bg-transparent text-[#555]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold">0{stepNum}</span>
                <span className="text-xs tracking-wide">{stage}</span>
              </div>

              <div>
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#333]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

