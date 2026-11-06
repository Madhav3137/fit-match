"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

export function ContinuousBackground() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const isReduced = !!shouldReduceMotion;

  // Mouse coordinate tracking with spring damping for ambient lighting parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.3);

  const springConfig = { damping: 35, stiffness: 45 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("resize", checkViewport);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Grids Parallax
  const gridY = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : -220]);
  const secondaryGridY = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : -420]);

  // Ambient Monochrome Lighting Drift
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["8%", "38%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["38%", "68%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["68%", "94%"]);

  const orb1X = useTransform(smoothMouseX, [0, 1], ["14%", "24%"]);
  const orb2X = useTransform(smoothMouseX, [0, 1], ["86%", "74%"]);
  const orb3X = useTransform(smoothMouseX, [0, 1], ["48%", "52%"]);

  // Telemetry Milestone Progression Rail
  const railProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-transparent"
    >
      {/* ============================================================== */}
      {/* DUAL ARCHITECTURAL PERSPECTIVE GRIDS WITH HIGHLIGHTS           */}
      {/* ============================================================== */}
      <motion.div
        style={{ y: gridY, willChange: "transform" }}
        className="absolute -inset-[30%] opacity-[0.038] bg-repeat pointer-events-none"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cont-fine-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="0.8" />
              <circle cx="40" cy="40" r="0.9" fill="#ffffff" opacity="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cont-fine-grid)" />
        </svg>
      </motion.div>

      {/* Major Architectural Module Grid & Intersection Crosshairs */}
      {!isMobile && (
        <motion.div
          style={{ y: secondaryGridY, willChange: "transform" }}
          className="absolute -inset-[30%] opacity-[0.024] bg-repeat pointer-events-none"
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cont-coarse-grid" width="160" height="160" patternUnits="userSpaceOnUse">
                <path
                  d="M 160 0 L 0 0 0 160"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="4 8"
                />
                <line x1="0" y1="-6" x2="0" y2="6" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#ffffff" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cont-coarse-grid)" />
          </svg>
        </motion.div>
      )}

      {/* Occasional Animated Grid Intersection Highlights */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.03, 0.12, 0.03] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[28%] left-[35%] w-8 h-8 pointer-events-none"
        >
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full stroke-white/60">
            <line x1="16" y1="0" x2="16" y2="32" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="0" y1="16" x2="32" y2="16" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="16" cy="16" r="4" strokeWidth="0.8" />
          </svg>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.02, 0.1, 0.02] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[64%] right-[28%] w-8 h-8 pointer-events-none hidden sm:block"
        >
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full stroke-white/60">
            <line x1="16" y1="0" x2="16" y2="32" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="0" y1="16" x2="32" y2="16" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="16" cy="16" r="4" strokeWidth="0.8" />
          </svg>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* AMBIENT RADIAL LIGHT FIELDS                                    */}
      {/* ============================================================== */}
      <motion.div
        style={{ top: orb1Y, left: orb1X, willChange: "top, left" }}
        className="absolute w-[680px] h-[680px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.048)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ top: orb2Y, left: orb2X, willChange: "top, left" }}
        className="absolute w-[780px] h-[780px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ top: orb3Y, left: orb3X, willChange: "top, left" }}
        className="absolute w-[850px] h-[850px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />

      {/* ============================================================== */}
      {/* LEFT FLANK TELEMETRY PROGRESSION RAIL                         */}
      {/* ============================================================== */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-6 sm:left-10 w-[1px] pointer-events-none hidden xl:block opacity-[0.18]"
      >
        <div className="absolute inset-y-0 w-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <motion.div
          style={{ top: railProgress }}
          className="absolute -left-[3px] w-[7px] h-[7px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
        <div className="absolute top-[10%] left-3 text-[9px] font-mono text-[#666] select-none">01 // HERO</div>
        <div className="absolute top-[28%] left-3 text-[9px] font-mono text-[#666] select-none">02 // BRANDS</div>
        <div className="absolute top-[48%] left-3 text-[9px] font-mono text-[#666] select-none">03 // FLOW</div>
        <div className="absolute top-[68%] left-3 text-[9px] font-mono text-[#666] select-none">04 // CALIBRATE</div>
        <div className="absolute top-[84%] left-3 text-[9px] font-mono text-[#666] select-none">05 // FAQ</div>
        <div className="absolute top-[95%] left-3 text-[9px] font-mono text-[#666] select-none">06 // SYNTHESIS</div>
      </div>
    </div>
  );
}
