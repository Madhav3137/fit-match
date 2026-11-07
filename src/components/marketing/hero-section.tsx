"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { BodyMesh3D } from "../ui/body-mesh-3d";
import { MaskedHeading } from "../motion/masked-text";
import { Magnetic } from "../motion/magnetic-button";
import { AnimatedCounter } from "../motion/animated-counter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { fadeInUp, TRANSITION_EASE } from "@/lib/motion/variants";
import { getStoredProfile } from "@/lib/storage/profile-storage";

export function HeroSection() {
  // 3D Parallax Tilt for the Card Frame
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  // Normalized measurements flow (stored profile or calibrated default)
  const [profileValues, setProfileValues] = React.useState({
    height: 178,
    shoulder: 46,
    chest: 98,
    waist: 84,
    hip: 102,
    inseam: 82,
    outseam: 106,
  });
  const [unit, setUnit] = React.useState<"cm" | "in">("cm");

  React.useEffect(() => {
    const stored = getStoredProfile();
    if (stored) {
      setProfileValues({
        height: stored.heightCm || 178,
        shoulder: stored.shoulderCm || 46,
        chest: stored.chestCm || 98,
        waist: stored.waistCm || 84,
        hip: stored.hipCm || 102,
        inseam: stored.inseamCm || 82,
        outseam: stored.outseamCm || 106,
      });
      if (stored.unit) setUnit(stored.unit);
    }
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleCardMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-transparent">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-14 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-8">
            {/* Technical Sub-Header Tag */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: TRANSITION_EASE }}
              className="flex items-center gap-3"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                FIT ENGINE // SYS.01
              </span>
              <span className="text-neutral-700">/</span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                UNIVERSAL SIZING MATRIX
              </span>
            </motion.div>

            {/* Split Headline with High Contrast & Balanced Serif Weights */}
            <div className="space-y-1 sm:space-y-2">
              <div>
                <MaskedHeading
                  as="h1"
                  delay={0.1}
                  wrap={true}
                  mode="characters"
                  className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-medium tracking-tight text-white uppercase leading-[1.06]"
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
                  className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-medium tracking-tight text-neutral-200 uppercase leading-[1.06]"
                >
                  EVERY BRAND.
                </MaskedHeading>
              </div>
            </div>

            {/* Supporting Copy with Clean Contrast */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-neutral-300 max-w-xl font-normal leading-relaxed text-balance"
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
              className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-800 text-left max-w-lg"
            >
              <div>
                <div className="text-white text-base sm:text-lg font-mono font-bold">
                  <AnimatedCounter value={100} suffix="%" />
                </div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">
                  Algorithmic Clarity
                </div>
              </div>

              <div>
                <div className="text-white text-base sm:text-lg font-mono font-bold">
                  <AnimatedCounter value={0} suffix="%" />
                </div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">
                  Fabricated Sizing Data
                </div>
              </div>

              <div>
                <div className="text-white text-base sm:text-lg font-mono font-bold">
                  <AnimatedCounter value={7} suffix="" />
                </div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">
                  Calibrated Dimensions
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Holographic Human Calibration Instrument */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Ambient Illumination Orb behind the 3D model */}
            <div
              aria-hidden="true"
              className="absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10"
            />

            {/* Holographic Container with 3D Tilt Frame */}
            <motion.div
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: TRANSITION_EASE }}
              className="relative w-full max-w-[450px] border border-neutral-800 rounded-3xl bg-[#0a0a0c]/90 backdrop-blur-md p-3 sm:p-5 shadow-2xl transition-colors hover:border-neutral-700 overflow-hidden"
            >
              {/* The Genuine 3D Calibration Instrument with Flowing User Profile */}
              <BodyMesh3D
                interactive={true}
                currentValues={profileValues}
                unit={unit}
                className="w-full min-h-[500px] sm:min-h-[560px]"
              />
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
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 group-hover:text-white transition-colors">
              EXPLORE ARCHITECTURE
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce text-neutral-400" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
