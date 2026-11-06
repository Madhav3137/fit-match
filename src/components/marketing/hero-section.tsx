"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { MeasurementDiagram } from "../ui/measurement-diagram";
import { MaskedHeading } from "../motion/masked-text";
import { Magnetic } from "../motion/magnetic-button";
import { AnimatedCounter } from "../motion/animated-counter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { fadeInUp, TRANSITION_EASE } from "@/lib/motion/variants";

export function HeroSection() {
  // 3D Parallax Tilt for the Measurement Graphic Card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["9deg", "-9deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-9deg", "9deg"]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleCardMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-transparent">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-8">
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
              <div className="overflow-hidden">
                <MaskedHeading
                  as="h1"
                  delay={0.1}
                  wrap={false}
                  mode="characters"
                  className="font-display text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-medium tracking-[-0.02em] text-white uppercase leading-[1.05]"
                >
                  YOUR SIZE.
                </MaskedHeading>
              </div>
              <div className="overflow-hidden">
                <MaskedHeading
                  as="h1"
                  delay={0.25}
                  wrap={false}
                  mode="characters"
                  className="font-display text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-normal tracking-[-0.02em] text-[#888888] uppercase leading-[1.05]"
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
                <div className="text-[10px] font-mono text-[#626262] uppercase tracking-wider mt-0.5">
                  Algorithmic Transparency
                </div>
              </div>

              <div>
                <div className="text-white text-base sm:text-lg font-mono font-bold">
                  <AnimatedCounter value={0} suffix="s" />
                </div>
                <div className="text-[10px] font-mono text-[#626262] uppercase tracking-wider mt-0.5">
                  Fabricated Recommendations
                </div>
              </div>

              <div>
                <div className="text-white text-base sm:text-lg font-mono font-bold">
                  <AnimatedCounter value={6} suffix=" pts" />
                </div>
                <div className="text-[10px] font-mono text-[#626262] uppercase tracking-wider mt-0.5">
                  Standardized Calibration
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Measurement Line-Art Visual with Ambient Depth & 3D Parallax */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Subtle rotating orbital caliper graphic behind illustration */}
            <motion.div
              aria-hidden="true"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="absolute w-[500px] h-[500px] pointer-events-none opacity-[0.14] -z-10 select-none"
            >
              <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="250" cy="250" r="240" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 10" />
                <circle cx="250" cy="250" r="210" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="2 6" />
                <circle cx="250" cy="250" r="160" stroke="#ffffff" strokeWidth="0.5" />
                <line x1="250" y1="0" x2="250" y2="500" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3 6" />
                <line x1="0" y1="250" x2="500" y2="250" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3 6" />
                <circle cx="250" cy="10" r="3" fill="#ffffff" />
                <circle cx="250" cy="490" r="3" fill="#ffffff" />
                <circle cx="10" cy="250" r="3" fill="#ffffff" />
                <circle cx="490" cy="250" r="3" fill="#ffffff" />
              </svg>
            </motion.div>

            {/* Subtle background depth spotlight */}
            <div
              aria-hidden="true"
              className="absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] blur-2xl pointer-events-none -z-10"
            />

            {/* Technical Marking Crosshairs & Calibration Reticles */}
            <div aria-hidden="true" className="absolute -top-6 -left-6 text-[9px] font-mono text-[#444] pointer-events-none select-none hidden sm:block">
              +0.00 LAT // CALIPER
            </div>
            <div aria-hidden="true" className="absolute -top-6 -right-6 text-[9px] font-mono text-[#444] pointer-events-none select-none hidden sm:block">
              AXIS // 350×560
            </div>
            <div aria-hidden="true" className="absolute -bottom-6 -left-6 text-[9px] font-mono text-[#444] pointer-events-none select-none hidden sm:block">
              RADIAL GRID // ALIGN
            </div>
            <div aria-hidden="true" className="absolute -bottom-6 -right-6 text-[9px] font-mono text-[#444] pointer-events-none select-none hidden sm:block">
              SYS: 01.PRO
            </div>

            {/* Connecting guide lines */}
            <div aria-hidden="true" className="absolute -left-12 top-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent to-[#333] hidden xl:block pointer-events-none" />
            <div aria-hidden="true" className="absolute -right-12 top-1/2 w-12 h-[1px] bg-gradient-to-l from-transparent to-[#333] hidden xl:block pointer-events-none" />

            <motion.div
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: TRANSITION_EASE }}
              className="relative w-full max-w-[420px] border border-[#282828] rounded-2xl bg-[#0c0c0c]/90 backdrop-blur-md p-6 shadow-2xl transition-colors hover:border-[#444]"
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
