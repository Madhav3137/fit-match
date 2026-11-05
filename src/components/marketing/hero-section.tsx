"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Container } from "../layout/container";
import { MeasurementDiagram } from "../ui/measurement-diagram";
import { TRANSITION_EASE, headlineLine, fadeInUp } from "@/lib/motion/variants";
import { ArrowRight, ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 bg-[#080808] bg-grid-pattern overflow-hidden">
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[75vh]">
          {/* Left Column: Editorial Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            {/* System Identifier */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: TRANSITION_EASE }}
              className="flex items-center gap-3"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] font-mono tracking-technical text-[#8e8e8e] uppercase">
                FIT ENGINE // SYS.01
              </span>
              <span className="text-[#303030]">/</span>
              <span className="text-[11px] font-mono tracking-technical text-[#626262] uppercase">
                UNIVERSAL SIZING
              </span>
            </motion.div>

            {/* Oversized Headline with line-by-line mask reveal */}
            <div className="space-y-1 overflow-hidden">
              <div className="overflow-hidden">
                <motion.h1
                  variants={headlineLine}
                  initial="hidden"
                  animate="visible"
                  className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white uppercase leading-[1.05]"
                >
                  YOUR SIZE.
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  variants={headlineLine}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.15 }}
                  className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#929292] uppercase leading-[1.05]"
                >
                  EVERY BRAND.
                </motion.h1>
              </div>
            </div>

            {/* Supporting Copy */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.35 }}
              className="text-base sm:text-lg text-[#999999] max-w-xl font-normal leading-relaxed"
            >
              One reusable body profile. Paste any product link to receive a brand- and
              garment-aware size recommendation based on real sizing data.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Link href="/profile">
                <Button size="lg" className="w-full sm:w-auto group flex items-center justify-center gap-2">
                  <span>Build your size profile</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  See how it works
                </Button>
              </Link>
            </motion.div>

            {/* Editorial Technical Guarantees */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.65 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-[#202020] text-left max-w-lg"
            >
              <div>
                <div className="text-white text-xs font-mono font-medium">100%</div>
                <div className="text-[10px] font-mono text-[#626262] uppercase tracking-wider mt-0.5">
                  Real Charts
                </div>
              </div>
              <div>
                <div className="text-white text-xs font-mono font-medium">ZERO</div>
                <div className="text-[10px] font-mono text-[#626262] uppercase tracking-wider mt-0.5">
                  Guesswork
                </div>
              </div>
              <div>
                <div className="text-white text-xs font-mono font-medium">PRIVATE</div>
                <div className="text-[10px] font-mono text-[#626262] uppercase tracking-wider mt-0.5">
                  Client Consent
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Measurement Line-Art Visual */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: TRANSITION_EASE }}
              className="relative w-full max-w-[400px] border border-[#262626] rounded-2xl bg-[#0c0c0c] p-6 shadow-2xl backdrop-blur-sm"
            >
              {/* Technical Header on Card */}
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#202020] text-[10px] font-mono text-[#626262]">
                <span className="text-[#a0a0a0]">CALIBRATION // M-01</span>
                <span>METRIC (CM)</span>
              </div>

              {/* The SVG Measurement Graphic */}
              <MeasurementDiagram interactive={true} />

              {/* Caption */}
              <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-[10px] font-mono text-[#666]">
                <span>UNIVERSAL HUMAN PROFILE</span>
                <span className="text-white">6 DATA POINTS</span>
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
