"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { MaskedHeading } from "../motion/masked-text";
import { Magnetic } from "../motion/magnetic-button";
import { AnimatedCounter } from "../motion/animated-counter";
import { ArrowRight, ChevronDown, Compass, Scan, Sparkles } from "lucide-react";
import { fadeInUp, TRANSITION_EASE } from "@/lib/motion/variants";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden bg-transparent">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-8 relative z-20">
            {/* Technical Sub-Header Tag */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: TRANSITION_EASE }}
              className="flex items-center gap-3"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] font-mono tracking-technical text-[#8e8e8e] uppercase">
                FIT ENGINE // SYS.01
              </span>
              <span className="text-[#303030]">/</span>
              <span className="text-[11px] font-mono tracking-technical text-[#626262] uppercase">
                UNIVERSAL SIZING MATRIX
              </span>
            </motion.div>

            {/* Split Headline with Character-by-Character Mask Reveals */}
            <div className="space-y-1">
              <div>
                <MaskedHeading
                  as="h1"
                  delay={0.1}
                  wrap={true}
                  mode="characters"
                  className="font-display text-4xl sm:text-6xl md:text-6xl lg:text-[4rem] xl:text-[5.25rem] font-medium tracking-tight text-white uppercase leading-[1.08]"
                >
                  YOUR SIZE.
                </MaskedHeading>
              </div>
              <div>
                <MaskedHeading
                  as="h1"
                  delay={0.25}
                  wrap={true}
                  mode="characters"
                  className="font-display text-4xl sm:text-6xl md:text-6xl lg:text-[4rem] xl:text-[5.25rem] font-normal tracking-tight text-[#888888] uppercase leading-[1.08]"
                >
                  EVERY BRAND.
                </MaskedHeading>
              </div>
            </div>

            {/* Supporting Copy with Balanced Wrap */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-[#999999] max-w-xl font-normal leading-relaxed text-balance"
            >
              One reusable body profile. Paste any product link to receive brand- and
              garment-aware size recommendations based on real sizing data.
            </motion.p>

            {/* Magnetic CTAs */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.55 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Magnetic strength={0.25}>
                <Link href="/profile">
                  <Button size="lg" className="w-full sm:w-auto group flex items-center justify-center gap-2">
                    <span>Build your size profile</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </Magnetic>

              <Magnetic strength={0.2}>
                <Link href="#how-it-works">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    See how it works
                  </Button>
                </Link>
              </Magnetic>
            </motion.div>

            {/* Statistics with Animated Number Counters */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-[#202020] text-left max-w-lg"
            >
              <div>
                <div className="text-white text-base sm:text-lg font-mono font-bold">
                  <AnimatedCounter value={100} suffix="%" />
                </div>
                <div className="text-[10px] font-mono text-[#777] uppercase tracking-wider mt-0.5">
                  Algorithmic Clarity
                </div>
              </div>

              <div>
                <div className="text-white text-base sm:text-lg font-mono font-bold">
                  <AnimatedCounter value={0} suffix="%" />
                </div>
                <div className="text-[10px] font-mono text-[#777] uppercase tracking-wider mt-0.5">
                  Fabricated Sizing Data
                </div>
              </div>

              <div>
                <div className="text-white text-base sm:text-lg font-mono font-bold">
                  <AnimatedCounter value={6} suffix="" />
                </div>
                <div className="text-[10px] font-mono text-[#777] uppercase tracking-wider mt-0.5">
                  Calibrated Dimensions
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Open Architectural Telemetry Window into the 3D Mannequin */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[460px] sm:min-h-[520px] pointer-events-none">
            {/* Ambient Illumination Vignette */}
            <div
              aria-hidden="true"
              className="absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] blur-3xl -z-10"
            />

            {/* Precision HUD Reticle Frame Framing the Massive Background Mannequin */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: TRANSITION_EASE }}
              className="relative w-full max-w-[420px] p-6 rounded-3xl border border-white/10 bg-white/[0.015] backdrop-blur-[2px] shadow-2xl flex flex-col justify-between h-[460px] sm:h-[500px]"
            >
              {/* Top HUD Status */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#888] pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Scan className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span className="text-white font-medium uppercase tracking-wider">3D SENSING RIG</span>
                </div>
                <span className="text-[#aaa] tracking-wider uppercase">TURNTABLE: ACTIVE</span>
              </div>

              {/* Center Open Focal Chamber - Transparent View Direct to Massive 3D Model */}
              <div className="relative my-auto flex flex-col items-center justify-center space-y-3 select-none">
                <div className="w-24 h-24 rounded-full border border-dashed border-white/20 flex items-center justify-center animate-[spin_40s_linear_infinite]">
                  <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center">
                    <Compass className="w-6 h-6 text-white/70" />
                  </div>
                </div>
                <div className="text-[10px] font-mono text-[#888] tracking-widest uppercase bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  REAL-TIME CALIBRATION // 360°
                </div>
              </div>

              {/* Bottom HUD Dimension Readouts */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#777]">
                <div className="flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>LASER SCANNER ACTIVE</span>
                </div>
                <span className="text-[#aaa]">TOLERANCE ±1.2MM</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center pt-8 text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          <Link href="#how-it-works" className="flex flex-col items-center gap-1 group">
            <span className="text-[10px] font-mono tracking-technical uppercase text-[#555] group-hover:text-[#999]">
              EXPLORE ARCHITECTURE
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#666]" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
