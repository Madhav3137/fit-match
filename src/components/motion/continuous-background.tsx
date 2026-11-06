"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function ContinuousBackground() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const isReduced = !!shouldReduceMotion;

  // Parallax subtle grid translation
  const gridY = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : -140]);

  // Subtle ambient lighting translation
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["10%", "35%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["40%", "70%"]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-transparent"
    >
      {/* 1. Fine Architectural Drafting Grid (Restrained, elegant, non-intrusive) */}
      <motion.div
        style={{ y: gridY, willChange: "transform" }}
        className="absolute -inset-[20%] opacity-[0.024] bg-repeat pointer-events-none"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="arch-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arch-grid)" />
        </svg>
      </motion.div>

      {/* 2. Soft Ambient Vignette Orbs */}
      <motion.div
        style={{ top: orb1Y }}
        className="absolute left-[20%] w-[600px] h-[600px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ top: orb2Y }}
        className="absolute right-[15%] w-[700px] h-[700px] rounded-full translate-x-1/4 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
    </div>
  );
}
