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

interface CanvasParticle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  depth: number; // 0.3 (deep background) to 1.8 (foreground)
  alpha: number;
  speed: number;
  freqX: number;
  freqY: number;
  phaseX: number;
  phaseY: number;
  isGlowNode?: boolean;
}

export function ContinuousBackground() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const isReduced = !!shouldReduceMotion;

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = React.useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  // Mouse coordinate tracking with spring damping for ambient lighting parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.3);

  const springConfig = { damping: 35, stiffness: 45 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const [isMobile, setIsMobile] = React.useState(false);

  // 1. CANVAS PARTICLE SYSTEM WITH PROXIMITY CONNECTIONS & NATURAL ORGANIC MOVEMENT
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const checkMobile = () => window.innerWidth < 768;
    const mobile = checkMobile();
    setIsMobile(mobile);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize hundreds of floating particles
    const particleCount = mobile ? 65 : 185;
    const particles: CanvasParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const depth = Math.random() * 1.5 + 0.3; // 0.3 to 1.8
      const radius = (Math.random() * 1.4 + 0.6) * (depth > 1.2 ? 1.3 : 0.85);
      const px = Math.random() * width;
      const py = Math.random() * height;

      particles.push({
        x: px,
        y: py,
        baseX: px,
        baseY: py,
        radius,
        depth,
        alpha: (Math.random() * 0.35 + 0.15) * (depth / 1.5),
        speed: (Math.random() * 0.4 + 0.2) * depth,
        freqX: Math.random() * 0.0012 + 0.0004,
        freqY: Math.random() * 0.0012 + 0.0004,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        isGlowNode: i % 14 === 0,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      const mX = mousePosRef.current.x;
      const mY = mousePosRef.current.y;
      const mActive = mousePosRef.current.active;
      const scrollProgress = scrollYProgress.get();

      // Proximity connection distance limit
      const maxDist = mobile ? 65 : 88;

      // Update particle positions with organic sinusoidal drift and mouse influence
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isReduced) {
          // Continuous organic oscillation
          const driftX = Math.sin(elapsed * p.freqX + p.phaseX) * (18 * p.depth);
          const driftY = Math.cos(elapsed * p.freqY + p.phaseY) * (18 * p.depth);

          // Scroll parallax displacement based on depth
          const scrollShiftY = scrollProgress * (-260 * p.depth);

          let targetX = (p.baseX + driftX) % width;
          if (targetX < 0) targetX += width;

          let targetY = (p.baseY + driftY + scrollShiftY) % height;
          if (targetY < 0) targetY += height;

          // Gentle mouse repulsion/attraction
          if (mActive) {
            const dx = targetX - mX;
            const dy = targetY - mY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influenceRadius = 140 * p.depth;

            if (dist < influenceRadius && dist > 0) {
              const force = (1 - dist / influenceRadius) * 22;
              targetX += (dx / dist) * force;
              targetY += (dy / dist) * force;
            }
          }

          p.x = targetX;
          p.y = targetY;
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isGlowNode && !mobile) {
          ctx.save();
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(p.alpha * 1.5, 0.75)})`;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();
        }

        // Connect nearby particles on same/similar depth plane
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist && Math.abs(p.depth - p2.depth) < 0.75) {
            const lineAlpha = (1 - dist / maxDist) * 0.11 * Math.min(p.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [scrollYProgress, isReduced]);

  // 2. SCROLL STORYTELLING: TRANSFORMATIONS & PARALLAX SPEEDS
  // Grids
  const gridY = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : -220]);
  const secondaryGridY = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : -420]);

  // Upper Right Orbital Structure (Hero -> Retailers)
  const orbital1Rotate = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : 360]);
  const orbital1Counter = useTransform(scrollYProgress, [0, 1], [360, isReduced ? 360 : 0]);
  const orbital1Scale = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [1, 1.12, 1.05, 0.94]);
  const orbital1Y = useTransform(scrollYProgress, [0, 0.5], [0, isReduced ? 0 : 140]);

  // Mid-Page Left Orbital Structure (Flow -> Calibration)
  const orbital2Rotate = useTransform(scrollYProgress, [0, 1], [180, isReduced ? 180 : -90]);
  const orbital2Y = useTransform(scrollYProgress, [0.2, 0.8], [-90, isReduced ? 0 : 180]);
  const orbital2Scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.9, 1.1, 0.95]);

  // 3. AMBIENT MONOCHROME LIGHTING DRIFT
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["8%", "38%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["38%", "68%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["68%", "94%"]);

  const orb1X = useTransform(smoothMouseX, [0, 1], ["14%", "24%"]);
  const orb2X = useTransform(smoothMouseX, [0, 1], ["86%", "74%"]);
  const orb3X = useTransform(smoothMouseX, [0, 1], ["48%", "52%"]);

  // 4. TELEMETRY MILESTONE PROGRESSION RAIL
  const railProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#080808]"
    >
      {/* ============================================================== */}
      {/* LAYER A: DUAL ARCHITECTURAL PERSPECTIVE GRIDS WITH HIGHLIGHTS */}
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
                {/* Intersection Crosshairs */}
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
      {/* LAYER B: AMBIENT RADIAL LIGHT FIELDS (Monochrome Grey-White)   */}
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
      {/* LAYER C: HIGH PERFORMANCE CANVAS PARTICLE SYSTEM               */}
      {/* ============================================================== */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* ============================================================== */}
      {/* LAYER D: CONCENTRIC ORBITAL STRUCTURES WITH MOVING SATELLITES  */}
      {/* ============================================================== */}
      {/* 1. Upper Right Concentric Orbital (Hero & Retailers) */}
      <motion.div
        style={{
          y: orbital1Y,
          scale: orbital1Scale,
          willChange: "transform",
        }}
        className="absolute top-[12%] right-[-140px] sm:right-[-60px] w-[620px] h-[620px] pointer-events-none opacity-[0.095]"
      >
        {/* Outer Clockwise Caliper */}
        <motion.svg
          style={{ rotate: orbital1Rotate }}
          viewBox="0 0 620 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full absolute inset-0"
        >
          <circle cx="310" cy="310" r="300" stroke="#ffffff" strokeWidth="1" strokeDasharray="8 10" />
          <circle cx="310" cy="310" r="240" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 6" />
          <circle cx="310" cy="310" r="180" stroke="#ffffff" strokeWidth="0.5" />
          <line x1="310" y1="0" x2="310" y2="620" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="0" y1="310" x2="620" y2="310" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          {/* Orbital Satellite Nodes */}
          <circle cx="310" cy="10" r="3.5" fill="#ffffff" />
          <circle cx="310" cy="610" r="3.5" fill="#ffffff" />
          <circle cx="10" cy="310" r="3.5" fill="#ffffff" />
          <circle cx="610" cy="310" r="3.5" fill="#ffffff" />
        </motion.svg>

        {/* Inner Counter-Clockwise Dotted Ring with Orbiting Pulse */}
        <motion.svg
          style={{ rotate: orbital1Counter }}
          viewBox="0 0 620 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full absolute inset-0"
        >
          <circle cx="310" cy="310" r="270" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="2 6" />
          <circle cx="310" cy="310" r="140" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="310" r="2.5" fill="#ffffff" />
          <circle cx="120" cy="310" r="2.5" fill="#ffffff" />
        </motion.svg>
      </motion.div>

      {/* 2. Mid-Page Left Anatomical Curvature Orbital (Flow & Calibration) */}
      {!isMobile && (
        <motion.div
          style={{
            y: orbital2Y,
            rotate: orbital2Rotate,
            scale: orbital2Scale,
            willChange: "transform",
          }}
          className="absolute top-[46%] left-[-180px] w-[520px] h-[520px] pointer-events-none opacity-[0.08]"
        >
          <svg viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="260" cy="260" r="250" stroke="#ffffff" strokeWidth="1" strokeDasharray="8 12" />
            <circle cx="260" cy="260" r="200" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 5" />
            <circle cx="260" cy="260" r="150" stroke="#ffffff" strokeWidth="0.5" />
            <line x1="10" y1="260" x2="510" y2="260" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="4 6" />
            <line x1="260" y1="10" x2="260" y2="510" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="4 6" />
            <rect x="250" y="250" width="20" height="20" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="260" cy="10" r="3" fill="#ffffff" />
            <circle cx="260" cy="510" r="3" fill="#ffffff" />
          </svg>
        </motion.div>
      )}

      {/* ============================================================== */}
      {/* LAYER E: LEFT FLANK TELEMETRY PROGRESSION RAIL                 */}
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
