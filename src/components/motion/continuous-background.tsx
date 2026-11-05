"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  MotionValue,
} from "framer-motion";

interface Particle {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // px 1-3.5
  opacity: number; // 0.15 - 0.55
  depth: number; // parallax factor 0.3 - 1.8
  driftX: number;
  driftDuration: number;
}

function ParticleItem({
  particle,
  scrollYProgress,
  isReduced,
}: {
  particle: Particle;
  scrollYProgress: MotionValue<number>;
  isReduced: boolean;
}) {
  const yScroll = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isReduced ? 0 : particle.depth * -340]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={
        isReduced
          ? { opacity: particle.opacity * 0.7 }
          : {
              opacity: [particle.opacity * 0.4, particle.opacity, particle.opacity * 0.4],
              x: [0, particle.driftX, 0],
            }
      }
      transition={{
        duration: particle.driftDuration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        y: yScroll,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        willChange: "transform, opacity",
      }}
      className="absolute rounded-full bg-white pointer-events-none"
    />
  );
}

export function ContinuousBackground() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const isReduced = !!shouldReduceMotion;

  // Mouse coordinate tracking with spring damping for ambient lighting parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.3);

  const springConfig = { damping: 35, stiffness: 50 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const [particles, setParticles] = React.useState<Particle[]>([]);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };

    const mobile = checkViewport();
    window.addEventListener("resize", checkViewport);

    const count = mobile ? 14 : 36;
    const generated: Particle[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1.2,
        opacity: Math.random() * 0.35 + 0.15,
        depth: Math.random() * 1.4 + 0.4,
        driftX: (Math.random() - 0.5) * 40,
        driftDuration: Math.random() * 14 + 10,
      });
    }
    setParticles(generated);

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

  // 1. DUAL PERSPECTIVE TECHNICAL GRIDS (Different speeds)
  const gridY = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : -260]);
  const secondaryGridY = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : -480]);

  // 2. SCROLL STORYTELLING: CHAPTER-LINKED GEOMETRIC TRANSFORMS
  // Chapter A: Hero -> Retailers (0 -> 0.35)
  const orbital1Rotate = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : 360]);
  const orbital1Scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    [1, 1.14, 1.05, 0.95]
  );
  const orbital1Y = useTransform(scrollYProgress, [0, 0.5], [0, isReduced ? 0 : 160]);

  // Chapter B: Process Flow -> Calibration (0.3 -> 0.75)
  const orbital2Rotate = useTransform(scrollYProgress, [0, 1], [180, isReduced ? 180 : -90]);
  const orbital2Y = useTransform(scrollYProgress, [0.2, 0.8], [-100, isReduced ? 0 : 200]);
  const orbital2Scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.9, 1.12, 0.95]);

  // Chapter C: Interactive Terminal -> CTA -> FAQ (0.6 -> 1.0)
  const terminalRingsRotate = useTransform(
    scrollYProgress,
    [0.5, 1],
    [0, isReduced ? 0 : 180]
  );
  const terminalRingsScale = useTransform(
    scrollYProgress,
    [0.5, 0.8, 1],
    [0.88, 1.08, 0.98]
  );
  const terminalRingsOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.75, 1],
    [0.02, 0.085, 0.04]
  );

  // 3. PERSISTENT AMBIENT LIGHTING (Smooth vertical translation through whole page)
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["6%", "42%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["36%", "68%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["68%", "94%"]);

  // Mouse parallax on ambient lights
  const orb1X = useTransform(smoothMouseX, [0, 1], ["12%", "22%"]);
  const orb2X = useTransform(smoothMouseX, [0, 1], ["88%", "76%"]);
  const orb3X = useTransform(smoothMouseX, [0, 1], ["46%", "54%"]);

  // 4. VERTICAL CALIBRATION RAIL (Drawing line down left flank)
  const railProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#080808]"
    >
      {/* LAYER 1: CONTINUOUS FINE TECHNICAL GRID */}
      <motion.div
        style={{ y: gridY, willChange: "transform" }}
        className="absolute -inset-[30%] opacity-[0.038] bg-repeat pointer-events-none"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cont-fine-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" strokeWidth="0.8" />
              <circle cx="48" cy="48" r="1" fill="#ffffff" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cont-fine-grid)" />
        </svg>
      </motion.div>

      {/* LAYER 2: DEEP OFFSET COORDINATE GRID (Desktop only for max 60fps) */}
      {!isMobile && (
        <motion.div
          style={{ y: secondaryGridY, willChange: "transform" }}
          className="absolute -inset-[30%] opacity-[0.022] bg-repeat pointer-events-none"
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="cont-coarse-grid"
                width="144"
                height="144"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 144 0 L 0 0 0 144"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                />
                <circle cx="0" cy="0" r="2" fill="#ffffff" opacity="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cont-coarse-grid)" />
          </svg>
        </motion.div>
      )}

      {/* LAYER 3: CONTINUOUS AMBIENT LIGHTING ORBS */}
      <motion.div
        style={{ top: orb1Y, left: orb1X, willChange: "top, left" }}
        className="absolute w-[680px] h-[680px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ top: orb2Y, left: orb2X, willChange: "top, left" }}
        className="absolute w-[780px] h-[780px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ top: orb3Y, left: orb3X, willChange: "top, left" }}
        className="absolute w-[850px] h-[850px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />

      {/* LAYER 4: FLOATING AMBIENT PARTICLES (Individually depth-linked) */}
      {particles.map((p) => (
        <ParticleItem
          key={p.id}
          particle={p}
          scrollYProgress={scrollYProgress}
          isReduced={isReduced}
        />
      ))}

      {/* LAYER 5: SCROLL STORYTELLING GEOMETRIC STRUCTURES */}
      {/* Chapter 1 & 2: Top-Right Orbital Caliper Arc */}
      <motion.div
        style={{
          y: orbital1Y,
          rotate: orbital1Rotate,
          scale: orbital1Scale,
          willChange: "transform",
        }}
        className="absolute top-[14%] right-[-120px] sm:right-[-60px] w-[560px] h-[560px] pointer-events-none opacity-[0.09]"
      >
        <svg viewBox="0 0 540 540" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="270" cy="270" r="260" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="270" cy="270" r="210" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 6" />
          <circle cx="270" cy="270" r="160" stroke="#ffffff" strokeWidth="0.5" />
          <line x1="270" y1="0" x2="270" y2="540" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="0" y1="270" x2="540" y2="270" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="270" cy="10" r="3" fill="#ffffff" />
          <circle cx="270" cy="530" r="3" fill="#ffffff" />
        </svg>
      </motion.div>

      {/* Chapter 3: Mid-page Left Anatomical Curvature Arc */}
      {!isMobile && (
        <motion.div
          style={{
            y: orbital2Y,
            rotate: orbital2Rotate,
            scale: orbital2Scale,
            willChange: "transform",
          }}
          className="absolute top-[48%] left-[-160px] w-[500px] h-[500px] pointer-events-none opacity-[0.075]"
        >
          <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="250" cy="250" r="240" stroke="#ffffff" strokeWidth="1" strokeDasharray="8 12" />
            <circle cx="250" cy="250" r="190" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 4" />
            <line x1="40" y1="250" x2="460" y2="250" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="4 6" />
            <rect x="240" y="240" width="20" height="20" stroke="#ffffff" strokeWidth="0.8" />
          </svg>
        </motion.div>
      )}

      {/* Chapter 4 & 5: Lower Interactive Terminal Harmonic Rings */}
      <motion.div
        style={{
          rotate: terminalRingsRotate,
          scale: terminalRingsScale,
          opacity: terminalRingsOpacity,
          willChange: "transform, opacity",
        }}
        className="absolute bottom-[8%] right-[-100px] w-[580px] h-[580px] pointer-events-none hidden md:block"
      >
        <svg viewBox="0 0 580 580" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="290" cy="290" r="280" stroke="#ffffff" strokeWidth="1" strokeDasharray="5 7" />
          <circle cx="290" cy="290" r="220" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="4 8" />
          <circle cx="290" cy="290" r="140" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="2 4" />
          <line x1="290" y1="10" x2="290" y2="570" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="10" y1="290" x2="570" y2="290" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 6" />
        </svg>
      </motion.div>

      {/* LAYER 6: ELEGANT LEFT FLANK SCROLL TRACKER RAIL */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-6 sm:left-10 w-[1px] pointer-events-none hidden xl:block opacity-[0.16]"
      >
        {/* Full guide track */}
        <div className="absolute inset-y-0 w-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        {/* Dynamic laser head marker */}
        <motion.div
          style={{ top: railProgress }}
          className="absolute -left-[3px] w-[7px] h-[7px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
        {/* Micro milestone labels along the scroll height */}
        <div className="absolute top-[12%] left-3 text-[9px] font-mono text-[#666] select-none">01 // HERO</div>
        <div className="absolute top-[32%] left-3 text-[9px] font-mono text-[#666] select-none">02 // BRANDS</div>
        <div className="absolute top-[54%] left-3 text-[9px] font-mono text-[#666] select-none">03 // FLOW</div>
        <div className="absolute top-[75%] left-3 text-[9px] font-mono text-[#666] select-none">04 // CALIBRATE</div>
        <div className="absolute top-[92%] left-3 text-[9px] font-mono text-[#666] select-none">05 // ARCHIVE</div>
      </div>
    </div>
  );
}
