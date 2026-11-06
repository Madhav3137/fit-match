"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { MaskedHeading } from "../motion/masked-text";
import { Magnetic } from "../motion/magnetic-button";
import { AnimatedCounter } from "../motion/animated-counter";
import { ArrowRight, ChevronDown, Compass, Activity, RotateCcw } from "lucide-react";
import { fadeInUp, TRANSITION_EASE } from "@/lib/motion/variants";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden bg-transparent">
      <Container>
        {/* Strategic 3-Part Proportional Layout: Left 38% | Center 35% | Right 27% */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 relative">
          {/* Part 1: Left 38% — Editorial Typography & CTAs */}
          <div className="w-full lg:w-[38%] space-y-8 relative z-20 shrink-0">
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
                  className="font-display text-4xl sm:text-6xl md:text-6xl lg:text-[3.8rem] xl:text-[4.6rem] font-medium tracking-tight text-white uppercase leading-[1.08]"
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
                  className="font-display text-4xl sm:text-6xl md:text-6xl lg:text-[3.8rem] xl:text-[4.6rem] font-normal tracking-tight text-[#888888] uppercase leading-[1.08]"
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
              className="text-base sm:text-lg text-[#999999] max-w-lg font-normal leading-relaxed text-balance"
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

          {/* Part 2: Center 35% — 3D Spatial Centerpiece Clearing */}
          {/* Dedicated open viewing corridor for the large, dominant 3D anatomical mannequin */}
          <div className="hidden lg:block lg:w-[35%] pointer-events-none self-stretch min-h-[480px]" aria-hidden="true" />

          {/* Part 3: Right 27% — Anthropometric Telemetry & Calibration Panel */}
          {/* Vertically aligned with the mannequin's torso */}
          <div className="w-full lg:w-[27%] flex justify-end relative z-20 pointer-events-none shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, delay: 0.45, ease: TRANSITION_EASE }}
              className="w-full max-w-[280px] p-5 rounded-2xl border border-white/10 bg-[#0c0c10]/80 backdrop-blur-md shadow-2xl flex flex-col justify-between space-y-4 pointer-events-auto"
            >
              {/* Top Status */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span className="text-white font-semibold uppercase tracking-wider">3D TELEMETRY</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("fitmatch:reset_view"));
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-colors"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>RESET</span>
                </button>
              </div>

              {/* Real-Time Anthropometric Coordinates Feed */}
              <div className="space-y-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("fitmatch:select_dimension", { detail: { dimension: "shoulder" } }));
                    }
                  }}
                  className="w-full flex items-center justify-between py-1 px-2 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left transition-colors cursor-pointer"
                >
                  <span className="text-[#888]">SHOULDERS</span>
                  <span className="text-white font-bold">46.0 CM</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("fitmatch:select_dimension", { detail: { dimension: "chest" } }));
                    }
                  }}
                  className="w-full flex items-center justify-between py-1 px-2 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left transition-colors cursor-pointer"
                >
                  <span className="text-[#888]">CHEST RING</span>
                  <span className="text-white font-bold">98.0 CM</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("fitmatch:select_dimension", { detail: { dimension: "waist" } }));
                    }
                  }}
                  className="w-full flex items-center justify-between py-1 px-2 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left transition-colors cursor-pointer"
                >
                  <span className="text-[#888]">NATURAL WAIST</span>
                  <span className="text-white font-bold">84.0 CM</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("fitmatch:select_dimension", { detail: { dimension: "hip" } }));
                    }
                  }}
                  className="w-full flex items-center justify-between py-1 px-2 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left transition-colors cursor-pointer"
                >
                  <span className="text-[#888]">PELVIC SEAT</span>
                  <span className="text-white font-bold">102.0 CM</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("fitmatch:select_dimension", { detail: { dimension: "inseam" } }));
                    }
                  }}
                  className="w-full flex items-center justify-between py-1 px-2 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left transition-colors cursor-pointer"
                >
                  <span className="text-[#888]">INNER INSEAM</span>
                  <span className="text-white font-bold">82.0 CM</span>
                </button>
              </div>

              {/* 360° Drag Cue & Laser Status */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#777]">
                <div className="flex items-center gap-1.5 text-white">
                  <Compass className="w-3 h-3 text-neutral-300 animate-[spin_15s_linear_infinite]" />
                  <span>DRAG TO ROTATE 360°</span>
                </div>
                <span className="text-[#999]">TOLERANCE ±1.2MM</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center pt-10 text-neutral-600 hover:text-neutral-400 transition-colors"
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
