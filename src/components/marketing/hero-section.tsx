"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Button } from "../ui/button";
import { Container } from "../layout/container";
import { MeasurementDiagram } from "../ui/measurement-diagram";
import { Magnetic } from "../motion/magnetic-button";
import { MaskedHeading } from "../motion/masked-text";
import { AnimatedCounter } from "../motion/animated-counter";
import { TRANSITION_EASE, fadeInUp } from "@/lib/motion/variants";
import { ArrowRight, ChevronDown } from "lucide-react";

export function HeroSection() {
  const rotateX = useSpring(useMotionValue(0), { damping: 20, stiffness: 120 });
  const rotateY = useSpring(useMotionValue(0), { damping: 20, stiffness: 120 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    rotateX.set(-y * 0.04);
    rotateY.set(x * 0.04);
  };

  const handleCardMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 bg-[#080808] bg-grid-pattern overflow-hidden">
      {/* Subtle vignette and animated atmospheric overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[75vh]">
          {/* Left Column: Editorial Typography, Masked Reveals & Magnetic CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            {/* System Identifier */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
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
                UNIVERSAL SIZING MATRIX
              </span>
            </motion.div>

            {/* Split Headline with Mask Reveals */}
            <div className="space-y-1">
              <div className="overflow-hidden">
                <MaskedHeading
                  as="h1"
                  delay={0.1}
                  className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white uppercase leading-[1.05]"
                >
                  YOUR SIZE.
                </MaskedHeading>
              </div>
              <div className="overflow-hidden">
                <MaskedHeading
                  as="h1"
                  delay={0.25}
                  className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#888888] uppercase leading-[1.05]"
                >
                  EVERY BRAND.
                </MaskedHeading>
              </div>
            </div>

            {/* Supporting Copy */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-[#999999] max-w-xl font-normal leading-relaxed"
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
                <div className="text-[10px] font-mono text-[#626262] uppercase tracking-wider mt-0.5">
                  Real Charts
                </div>
              </div>
              <div>
                <div className="text-white text-base sm:text-lg font-mono font-bold">
                  <AnimatedCounter value={0} prefix="0 " />
                </div>
                <div className="text-[10px] font-mono text-[#626262] uppercase tracking-wider mt-0.5">
                  Guesswork
                </div>
              </div>
              <div>
                <div className="text-white text-base sm:text-lg font-mono font-bold">
                  <AnimatedCounter value={6} suffix=" PTS" />
                </div>
                <div className="text-[10px] font-mono text-[#626262] uppercase tracking-wider mt-0.5">
                  Anatomical Anchor
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Measurement Line-Art Visual with 3D Parallax Tilt */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <motion.div
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: TRANSITION_EASE }}
              className="relative w-full max-w-[420px] border border-[#282828] rounded-2xl bg-[#0c0c0c] p-6 shadow-2xl backdrop-blur-sm transition-colors hover:border-[#444]"
            >
              {/* Header on Card */}
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#202020] text-[10px] font-mono text-[#626262]">
                <span className="text-[#a0a0a0]">CALIBRATION // M-01</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>METRIC (CM)</span>
                </span>
              </div>

              {/* The Interactive SVG Measurement Graphic */}
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
