"use client";

import * as React from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Container } from "../layout/container";
import { UserCheck, Link2, Sparkles, ShieldCheck, Database, ArrowRight } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

export function StepFlowPinned() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate active chapter (0, 1, or 2)
  const [activeStage, setActiveStage] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.36) {
        setActiveStage(0);
      } else if (latest < 0.7) {
        setActiveStage(1);
      } else {
        setActiveStage(2);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Stage transforms
  const stage1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.36], [1, 1, 0]);
  const stage1Scale = useTransform(scrollYProgress, [0, 0.28, 0.36], [1, 1, 0.92]);

  const stage2Opacity = useTransform(scrollYProgress, [0.33, 0.42, 0.64, 0.72], [0, 1, 1, 0]);
  const stage2Scale = useTransform(scrollYProgress, [0.33, 0.42, 0.64, 0.72], [0.92, 1, 1, 0.92]);

  const stage3Opacity = useTransform(scrollYProgress, [0.68, 0.76, 1], [0, 1, 1]);
  const stage3Scale = useTransform(scrollYProgress, [0.68, 0.76, 1], [0.92, 1, 1]);

  // Progress line height
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative h-[320vh] bg-transparent"
    >
      {/* Sticky Full-Screen Storytelling Chamber */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Rotating Atmospheric Wireframe Compass */}
        <div
          aria-hidden="true"
          className="absolute w-[800px] h-[800px] pointer-events-none opacity-[0.06] select-none"
        >
          <svg viewBox="0 0 800 800" fill="none" className="w-full h-full animate-[spin_160s_linear_infinite]">
            <circle cx="400" cy="400" r="380" stroke="#ffffff" strokeWidth="1" strokeDasharray="8 12" />
            <circle cx="400" cy="400" r="300" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="4 8" />
            <circle cx="400" cy="400" r="220" stroke="#ffffff" strokeWidth="0.5" />
            <line x1="400" y1="20" x2="400" y2="780" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="6 6" />
            <line x1="20" y1="400" x2="780" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="6 6" />
          </svg>
        </div>

        <Container className="relative z-10 w-full h-full flex flex-col justify-between py-16 sm:py-20">
          {/* Top Section Milestone Header */}
          <div className="flex items-center justify-between border-b border-[#202020] pb-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-mono tracking-technical text-[#888] uppercase">
                CINEMATIC OPERATIONAL FLOW // 3 MOVEMENTS
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#666]">
              SCROLL DOWN TO PROGRESS CHOREOGRAPHY
            </div>
          </div>

          {/* Center Stage Presentation Screen */}
          <div className="relative w-full max-w-5xl mx-auto my-auto min-h-[460px] sm:min-h-[520px] flex items-center justify-center">
            {/* ========================================================= */}
            {/* STAGE 01: BUILD YOUR PROFILE                             */}
            {/* ========================================================= */}
            <motion.div
              style={{
                opacity: stage1Opacity,
                scale: stage1Scale,
                pointerEvents: activeStage === 0 ? "auto" : "none",
              }}
              className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12"
            >
              <div className="lg:max-w-md space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-[#121212] text-[10px] font-mono text-[#888]">
                  <span>CHAPTER 01</span>
                  <span>/</span>
                  <span className="text-white">STANDARDIZED PROFILE</span>
                </div>
                <h3 className="font-display text-4xl sm:text-6xl font-medium tracking-tight text-white uppercase leading-[1.05]">
                  Construct Your Universal Matrix
                </h3>
                <p className="text-sm text-[#999] leading-relaxed">
                  Input height, chest, waist, hips, and inseam once. FITMATCH calculates body proportions
                  with zero gender assumptions and stores normalized dimensional metrics.
                </p>
                <div className="pt-2 flex items-center gap-4 text-[10px] font-mono text-[#666]">
                  <span className="flex items-center gap-1.5 text-white">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>6 ANATOMICAL COORDINATES</span>
                  </span>
                  <span>•</span>
                  <span>SECURE LOCAL PERSISTENCE</span>
                </div>
              </div>

              {/* Stage 1 Visual: Animated Anatomical Wireframe Calipers */}
              <div className="w-full max-w-[380px] sm:max-w-[420px] p-6 rounded-3xl border border-[#262626] bg-[#0c0c0c]/90 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1e1e1e] text-[10px] font-mono text-[#666]">
                  <span>BODY CALIBRATION PROTOCOL</span>
                  <span className="text-emerald-400">STATUS: ACTIVE</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {[
                    { label: "CHEST CIRCUMFERENCE", val: "98.0 CM", status: "VERIFIED" },
                    { label: "NATURAL WAIST", val: "84.0 CM", status: "VERIFIED" },
                    { label: "HIP SEAT WIDTH", val: "102.0 CM", status: "VERIFIED" },
                    { label: "BIACROMIAL SHOULDERS", val: "46.0 CM", status: "VERIFIED" },
                    { label: "INNER INSEAM", val: "82.0 CM", status: "VERIFIED" },
                  ].map((row, i) => (
                    <motion.div
                      key={row.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-[#202020] bg-[#141414]"
                    >
                      <span className="text-[#888] text-[10px]">{row.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold">{row.val}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white">
                          {row.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ========================================================= */}
            {/* STAGE 02: PASTE YOUR PRODUCT LINK                        */}
            {/* ========================================================= */}
            <motion.div
              style={{
                opacity: stage2Opacity,
                scale: stage2Scale,
                pointerEvents: activeStage === 1 ? "auto" : "none",
              }}
              className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12"
            >
              <div className="lg:max-w-md space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-[#121212] text-[10px] font-mono text-[#888]">
                  <span>CHAPTER 02</span>
                  <span>/</span>
                  <span className="text-white">INGESTION SCANNER</span>
                </div>
                <h3 className="font-display text-4xl sm:text-6xl font-medium tracking-tight text-white uppercase leading-[1.05]">
                  Optical Link Ingestion & Parsing
                </h3>
                <p className="text-sm text-[#999] leading-relaxed">
                  Submit any garment link. Our server performs anti-SSRF IP verification, activates
                  the retailer adapter, extracts metadata, and maps the exact product-specific size chart.
                </p>
                <div className="pt-2 flex items-center gap-4 text-[10px] font-mono text-[#666]">
                  <span className="flex items-center gap-1.5 text-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SSRF GUARD</span>
                  </span>
                  <span>•</span>
                  <span>AUTOMATIC JSON-LD & DOM EXTRACTION</span>
                </div>
              </div>

              {/* Stage 2 Visual: Cyber Scanning Tunnel */}
              <div className="w-full max-w-[380px] sm:max-w-[420px] p-6 rounded-3xl border border-[#262626] bg-[#0c0c0c]/90 backdrop-blur-md shadow-2xl relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1e1e1e] text-[10px] font-mono text-[#666]">
                  <span>RETAILER ADAPTER TUNNEL</span>
                  <span className="text-white">HTTPS SECURE</span>
                </div>

                {/* Simulated URL Ingest Box */}
                <div className="p-3 rounded-xl border border-neutral-700 bg-[#141414] font-mono text-xs flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-white shrink-0 animate-pulse" />
                  <span className="text-[#ccc] truncate">
                    https://zara.com/us/en/heavyweight-boxy-tee-p01.html
                  </span>
                </div>

                {/* Animated Pipeline Stage Readouts */}
                <div className="space-y-2 pt-2">
                  {[
                    "1. SSRF DNS & Private Range Clearance",
                    "2. OpenGraph & Microdata Classification",
                    "3. Size Chart Table Matrix Extraction",
                    "4. Dimension Normalization (Inches -> CM)",
                  ].map((line, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-[#aaa]">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>

                {/* Laser scan line across tunnel */}
                <motion.div
                  animate={{ y: [0, 160, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
                />
              </div>
            </motion.div>

            {/* ========================================================= */}
            {/* STAGE 03: GET YOUR PERFECT FIT                           */}
            {/* ========================================================= */}
            <motion.div
              style={{
                opacity: stage3Opacity,
                scale: stage3Scale,
                pointerEvents: activeStage === 2 ? "auto" : "none",
              }}
              className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12"
            >
              <div className="lg:max-w-md space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-[#121212] text-[10px] font-mono text-[#888]">
                  <span>CHAPTER 03</span>
                  <span>/</span>
                  <span className="text-white">DETERMINISTIC FIT</span>
                </div>
                <h3 className="font-display text-4xl sm:text-6xl font-medium tracking-tight text-white uppercase leading-[1.05]">
                  Deterministic Fit Recommendation
                </h3>
                <p className="text-sm text-[#999] leading-relaxed">
                  The calculation engine scores candidate sizes using garment-specific weights, range
                  penalties, and fit preferences. Outputting real fit explanations and trade-offs.
                </p>
                <div className="pt-2 flex items-center gap-4 text-[10px] font-mono text-[#666]">
                  <span className="flex items-center gap-1.5 text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ZERO FABRICATED ESTIMATES</span>
                  </span>
                  <span>•</span>
                  <span>CONFIDENCE GRADED</span>
                </div>
              </div>

              {/* Stage 3 Visual: Explosive Size Recommendation Card */}
              <div className="w-full max-w-[380px] sm:max-w-[420px] p-6 rounded-3xl border border-white/40 bg-[#0c0c0c]/95 backdrop-blur-md shadow-2xl relative overflow-hidden space-y-5 text-center">
                <div className="flex items-center justify-between pb-3 border-b border-[#222] text-[10px] font-mono text-[#888]">
                  <span>ALGORITHMIC OUTPUT</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-black font-bold">
                    HIGH CONFIDENCE
                  </span>
                </div>

                <div className="py-2">
                  <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase block mb-1">
                    OPTIMAL RECOMMENDED SIZE
                  </span>
                  <div className="text-7xl sm:text-8xl font-bold font-mono tracking-tighter text-white">
                    M
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#242424] bg-[#141414] text-xs font-mono text-[#aaa] text-left leading-relaxed">
                  Size M provides ideal 4cm ease for your 98cm chest with balanced drape across shoulders.
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Interactive Milestone Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-[#202020]">
            <div className="flex items-center gap-6">
              {[
                { stage: 0, label: "01 // PROFILE" },
                { stage: 1, label: "02 // SCANNER" },
                { stage: 2, label: "03 // SYNTHESIS" },
              ].map((item) => (
                <div
                  key={item.stage}
                  className={`text-xs font-mono transition-colors duration-200 ${
                    activeStage === item.stage
                      ? "text-white font-bold"
                      : "text-[#555]"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>

            {/* Micro Scroll Progress Line */}
            <div className="w-32 h-[2px] bg-[#222] relative overflow-hidden rounded-full">
              <motion.div
                style={{ width: lineHeight }}
                className="h-full bg-white"
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

