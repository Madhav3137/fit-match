"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function ContinuousBackground() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const isReduced = !!shouldReduceMotion;

  // Subtle architectural grid parallax
  const gridY = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : -140]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-transparent"
    >
      {/* Precision Technical Architectural Grid Overlay */}
      <motion.div
        style={{ y: gridY, willChange: "transform" }}
        className="absolute -inset-[20%] opacity-[0.026] bg-repeat pointer-events-none"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cont-fine-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#ffffff" strokeWidth="0.75" />
              <circle cx="44" cy="44" r="0.75" fill="#ffffff" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cont-fine-grid)" />
        </svg>
      </motion.div>

      {/* Soft Vignette Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(5,5,7,0.75)_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_0%,rgba(5,5,7,0.75)_80%)] pointer-events-none" />
    </div>
  );
}
