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
  depth: number;
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

  // 1. CANVAS PARTICLE SYSTEM WITH ORGANIC SINUSOIDAL DRIFT & PROXIMITY FILAMENTS
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

    // Initialize depth-stratified floating particles
    const particleCount = mobile ? 50 : 130;
    const particles: CanvasParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const depth = Math.random() * 1.5 + 0.3; // 0.3 (deep background) to 1.8 (foreground)
      const radius = (Math.random() * 1.2 + 0.5) * (depth > 1.2 ? 1.25 : 0.85);
      const px = Math.random() * width;
      const py = Math.random() * height;

      particles.push({
        x: px,
        y: py,
        baseX: px,
        baseY: py,
        radius,
        depth,
        alpha: (Math.random() * 0.3 + 0.12) * (depth / 1.5),
        speed: (Math.random() * 0.3 + 0.15) * depth,
        freqX: Math.random() * 0.001 + 0.0003,
        freqY: Math.random() * 0.001 + 0.0003,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        isGlowNode: i % 12 === 0,
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

    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      const mX = mousePosRef.current.x;
      const mY = mousePosRef.current.y;
      const mActive = mousePosRef.current.active;
      const scrollProgress = scrollYProgress.get();

      // Proximity connection distance limit
      const maxDist = mobile ? 55 : 75;

      // Update particle positions with organic sinusoidal drift and mouse influence
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isReduced) {
          // Continuous organic oscillation
          const driftX = Math.sin(elapsed * p.freqX + p.phaseX) * (14 * p.depth);
          const driftY = Math.cos(elapsed * p.freqY + p.phaseY) * (14 * p.depth);

          // Scroll parallax displacement based on depth
          const scrollShiftY = scrollProgress * (-200 * p.depth);

          let targetX = (p.baseX + driftX) % width;
          if (targetX < 0) targetX += width;

          let targetY = (p.baseY + driftY + scrollShiftY) % height;
          if (targetY < 0) targetY += height;

          // Gentle mouse deflection
          if (mActive) {
            const dx = targetX - mX;
            const dy = targetY - mY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influenceRadius = 120 * p.depth;

            if (dist < influenceRadius && dist > 0) {
              const force = (1 - dist / influenceRadius) * 16;
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
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(p.alpha * 1.4, 0.7)})`;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();
        }

        // Connect nearby particles on similar depth plane
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist && Math.abs(p.depth - p2.depth) < 0.65) {
            const lineAlpha = (1 - dist / maxDist) * 0.1 * Math.min(p.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.55;
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
  const gridY = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : -180]);
  const secondaryGridY = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : -320]);

  // Upper Right Orbital Structure (Hero -> Scanner)
  const orbital1Rotate = useTransform(scrollYProgress, [0, 1], [0, isReduced ? 0 : 360]);
  const orbital1Counter = useTransform(scrollYProgress, [0, 1], [360, isReduced ? 360 : 0]);
  const orbital1Scale = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [1, 1.1, 1.05, 0.95]);
  const orbital1Y = useTransform(scrollYProgress, [0, 0.5], [0, isReduced ? 0 : 120]);

  // Mid-Page Left Orbital Structure (Scanner -> Synthesis)
  const orbital2Rotate = useTransform(scrollYProgress, [0, 1], [180, isReduced ? 180 : -90]);
  const orbital2Y = useTransform(scrollYProgress, [0.2, 0.8], [-60, isReduced ? 0 : 140]);
  const orbital2Scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.92, 1.08, 0.96]);

  // 3. AMBIENT MONOCHROME LIGHTING DRIFT
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["6%", "32%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["36%", "64%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["66%", "92%"]);

  const orb1X = useTransform(smoothMouseX, [0, 1], ["16%", "24%"]);
  const orb2X = useTransform(smoothMouseX, [0, 1], ["84%", "76%"]);
  const orb3X = useTransform(smoothMouseX, [0, 1], ["48%", "52%"]);

  // 4. TELEMETRY MILESTONE PROGRESSION RAIL
  const railProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-transparent"
    >
      {/* ============================================================== */}
      {/* LAYER A: DUAL ARCHITECTURAL PERSPECTIVE GRIDS                 */}
      {/* ============================================================== */}
      <motion.div
        style={{ y: gridY, willChange: "transform" }}
        className="absolute -inset-[30%] opacity-[0.032] bg-repeat pointer-events-none"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cont-fine-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#ffffff" strokeWidth="0.75" />
              <circle cx="44" cy="44" r="0.8" fill="#ffffff" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cont-fine-grid)" />
        </svg>
      </motion.div>

      {/* Major Architectural Module Grid & Intersection Crosshairs */}
      {!isMobile && (
        <motion.div
          style={{ y: secondaryGridY, willChange: "transform" }}
          className="absolute -inset-[30%] opacity-[0.02] bg-repeat pointer-events-none"
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cont-coarse-grid" width="176" height="176" patternUnits="userSpaceOnUse">
                <path
                  d="M 176 0 L 0 0 0 176"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
                <line x1="0" y1="-5" x2="0" y2="5" stroke="#ffffff" strokeWidth="1.2" />
                <line x1="-5" y1="0" x2="5" y2="0" stroke="#ffffff" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cont-coarse-grid)" />
          </svg>
        </motion.div>
      )}

      {/* Subtle Floating Caliper Nodes */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.03, 0.09, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-[30%] w-8 h-8 pointer-events-none"
        >
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full stroke-white/50">
            <line x1="16" y1="0" x2="16" y2="32" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="0" y1="16" x2="32" y2="16" strokeWidth="0.8" strokeDasharray="2 2" />
            <circle cx="16" cy="16" r="3.5" strokeWidth="0.7" />
          </svg>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.02, 0.08, 0.02] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute top-[65%] right-[25%] w-8 h-8 pointer-events-none hidden sm:block"
        >
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full stroke-white/50">
            <line x1="16" y1="0" x2="16" y2="32" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="0" y1="16" x2="32" y2="16" strokeWidth="0.8" strokeDasharray="2 2" />
            <circle cx="16" cy="16" r="3.5" strokeWidth="0.7" />
          </svg>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* LAYER B: AMBIENT RADIAL LIGHT FIELDS                           */}
      {/* ============================================================== */}
      <motion.div
        style={{ top: orb1Y, left: orb1X, willChange: "top, left" }}
        className="absolute w-[650px] h-[650px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.045)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ top: orb2Y, left: orb2X, willChange: "top, left" }}
        className="absolute w-[720px] h-[720px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.038)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ top: orb3Y, left: orb3X, willChange: "top, left" }}
        className="absolute w-[800px] h-[800px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.032)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />

      {/* ============================================================== */}
      {/* LAYER C: CANVAS PARTICLE SYSTEM WITH DEPTH                     */}
      {/* ============================================================== */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* ============================================================== */}
      {/* LAYER D: CONCENTRIC ORBITAL STRUCTURES WITH SLOW ROTATION      */}
      {/* ============================================================== */}
      {/* 1. Upper Right Concentric Orbital (Hero & Chapter 01) */}
      <motion.div
        style={{
          y: orbital1Y,
          scale: orbital1Scale,
          willChange: "transform",
        }}
        className="absolute top-[10%] right-[-140px] sm:right-[-60px] w-[580px] h-[580px] pointer-events-none opacity-[0.08]"
      >
        <motion.svg
          style={{ rotate: orbital1Rotate }}
          viewBox="0 0 620 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full absolute inset-0"
        >
          <circle cx="310" cy="310" r="300" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="8 10" />
          <circle cx="310" cy="310" r="240" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="3 6" />
          <circle cx="310" cy="310" r="180" stroke="#ffffff" strokeWidth="0.5" />
          <line x1="310" y1="0" x2="310" y2="620" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="0" y1="310" x2="620" y2="310" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="310" cy="10" r="3" fill="#ffffff" />
          <circle cx="310" cy="610" r="3" fill="#ffffff" />
          <circle cx="10" cy="310" r="3" fill="#ffffff" />
          <circle cx="610" cy="310" r="3" fill="#ffffff" />
        </motion.svg>

        <motion.svg
          style={{ rotate: orbital1Counter }}
          viewBox="0 0 620 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full absolute inset-0"
        >
          <circle cx="310" cy="310" r="270" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="2 6" />
          <circle cx="310" cy="310" r="140" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="310" r="2" fill="#ffffff" />
          <circle cx="120" cy="310" r="2" fill="#ffffff" />
        </motion.svg>
      </motion.div>

      {/* 2. Mid-Page Left Anatomical Curvature Orbital */}
      {!isMobile && (
        <motion.div
          style={{
            y: orbital2Y,
            rotate: orbital2Rotate,
            scale: orbital2Scale,
            willChange: "transform",
          }}
          className="absolute top-[48%] left-[-160px] w-[500px] h-[500px] pointer-events-none opacity-[0.07]"
        >
          <svg viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="260" cy="260" r="250" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="8 12" />
            <circle cx="260" cy="260" r="200" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="2 5" />
            <circle cx="260" cy="260" r="150" stroke="#ffffff" strokeWidth="0.5" />
            <line x1="10" y1="260" x2="510" y2="260" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 6" />
            <line x1="260" y1="10" x2="260" y2="510" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 6" />
            <rect x="252" y="252" width="16" height="16" stroke="#ffffff" strokeWidth="0.7" />
            <circle cx="260" cy="10" r="2.5" fill="#ffffff" />
            <circle cx="260" cy="510" r="2.5" fill="#ffffff" />
          </svg>
        </motion.div>
      )}

      {/* ============================================================== */}
      {/* LAYER E: LEFT FLANK TELEMETRY PROGRESSION RAIL                 */}
      {/* ============================================================== */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-6 sm:left-10 w-[1px] pointer-events-none hidden xl:block opacity-[0.15]"
      >
        <div className="absolute inset-y-0 w-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <motion.div
          style={{ top: railProgress }}
          className="absolute -left-[3px] w-[7px] h-[7px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
        <div className="absolute top-[8%] left-3 text-[9px] font-mono text-[#666] select-none">01 // HERO</div>
        <div className="absolute top-[26%] left-3 text-[9px] font-mono text-[#666] select-none">02 // PROFILE</div>
        <div className="absolute top-[46%] left-3 text-[9px] font-mono text-[#666] select-none">03 // SCANNER</div>
        <div className="absolute top-[66%] left-3 text-[9px] font-mono text-[#666] select-none">04 // SYNTHESIS</div>
        <div className="absolute top-[82%] left-3 text-[9px] font-mono text-[#666] select-none">05 // ECOSYSTEM</div>
        <div className="absolute top-[94%] left-3 text-[9px] font-mono text-[#666] select-none">06 // FINALE</div>
      </div>
    </div>
  );
}
