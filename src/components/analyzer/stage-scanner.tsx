"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface StageScannerProps {
  currentStep: number;
  stages: string[];
}

export function StageScanner({ currentStep, stages }: StageScannerProps) {
  return (
    <div className="p-8 rounded-3xl border border-[#303030] bg-[#0c0c0c] relative overflow-hidden space-y-6 shadow-2xl">
      {/* Background Precision Scan Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Dual Laser Scanning Line Sweep Motif */}
      <motion.div
        animate={{ y: ["0%", "350%", "0%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none z-10"
      />

      <div className="flex items-center justify-between pb-4 border-b border-[#222] relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase">
            SERVER EVALUATION IN PROGRESS
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#555]">
          HTTPS // SSRF PROTECTED
        </span>
      </div>

      <div className="space-y-3 relative z-10">
        {stages.map((stage, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? "border-neutral-400 bg-[#161616] text-white shadow-md shadow-white/[0.02]"
                  : isDone
                  ? "border-[#242424] bg-[#111111] text-neutral-300"
                  : "border-transparent bg-transparent text-[#555]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#888]">
                  0{stepNum}
                </span>
                <span className="text-xs tracking-wide font-medium">
                  {stage}
                </span>
              </div>

              <div>
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-white"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </motion.div>
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#333]" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
