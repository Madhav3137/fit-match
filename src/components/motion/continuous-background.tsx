"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from "framer-motion";

interface Particle {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // px 1-3.5
  opacity: number; // 0.15 - 0.55
  depth: number; // parallax factor 0.3 - 1.2
  driftX: number;
  driftDuration: number;
}

function ParticleItem({
  particle,
  scrollYProgress,
}: {
  particle: Particle;
  scrollYProgress: MotionValue<number>;
}) {
  const yScroll = useTransform(scrollYProgress, [0, 1], [0, particle.depth * -260]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [particle.opacity * 0.4, particle.opacity, particle.opacity * 0.4],
        x: [0, particle.driftX, 0],
      }}
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
      }}
      className="absolute rounded-full bg-white pointer-events-none"
    />
  );
}

export function ContinuousBackground() {
  const { scrollYProgress } = useScroll();

  // Mouse coordinate tracking for ambient lighting parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.3);

  const springConfig = { damping: 30, stiffness: 60 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const [particles, setParticles] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 16 : 38;
    const generated: Particle[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1.2,
        opacity: Math.random() * 0.35 + 0.15,
        depth: Math.random() * 1.0 + 0.4,
        driftX: (Math.random() - 0.5) * 45,
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
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Continuous Parallax Scroll Transforms across page
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const secondaryGridY = useTransform(scrollYProgress, [0, 1], [0, -360]);
  const orbitalRotate = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const orbitalScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.12, 0.96]);

  // Ambient lighting vertical translation
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["5%", "65%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["45%", "20%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["75%", "92%"]);

  // Mouse parallax on ambient lights
  const orb1X = useTransform(smoothMouseX, [0, 1], ["10%", "20%"]);
  const orb2X = useTransform(smoothMouseX, [0, 1], ["85%", "75%"]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. LAYER A: CONTINUOUS PERSPECTIVE TECHNICAL GRID */}
      <motion.div
        style={{ y: gridY }}
        className="absolute -inset-[30%] opacity-[0.035] bg-repeat pointer-events-none"
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

      {/* Secondary micro-offset coordinate grid layer */}
      <motion.div
        style={{ y: secondaryGridY }}
        className="absolute -inset-[30%] opacity-[0.022] bg-repeat pointer-events-none hidden sm:block"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cont-coarse-grid" width="144" height="144" patternUnits="userSpaceOnUse">
              <path d="M 144 0 L 0 0 0 144" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="4 6" />
              <circle cx="0" cy="0" r="2" fill="#ffffff" opacity="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cont-coarse-grid)" />
        </svg>
      </motion.div>

      {/* 2. LAYER B: MONOCHROME AMBIENT LIGHTING ORBS */}
      <motion.div
        style={{ top: orb1Y, left: orb1X }}
        className="absolute w-[680px] h-[680px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ top: orb2Y, left: orb2X }}
        className="absolute w-[780px] h-[780px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ top: orb3Y }}
        className="absolute left-[50%] w-[850px] h-[850px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />

      {/* 3. LAYER C: FLOATING AMBIENT PARTICLES (Scroll-responsive) */}
      {particles.map((p) => (
        <ParticleItem key={p.id} particle={p} scrollYProgress={scrollYProgress} />
      ))}

      {/* 4. LAYER D: ANIMATED GEOMETRIC LINES & ORBITAL MEASUREMENT ARCS */}
      <div className="absolute top-[20%] right-[-100px] sm:right-[-60px] w-[560px] h-[560px] pointer-events-none opacity-[0.09]">
        <motion.svg
          style={{ rotate: orbitalRotate, scale: orbitalScale }}
          viewBox="0 0 540 540"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Orbital Caliper Arc */}
          <circle cx="270" cy="270" r="260" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="270" cy="270" r="210" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 6" />
          <circle cx="270" cy="270" r="160" stroke="#ffffff" strokeWidth="0.5" />
          <line x1="270" y1="0" x2="270" y2="540" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="0" y1="270" x2="540" y2="270" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="270" cy="10" r="3" fill="#ffffff" />
          <circle cx="270" cy="530" r="3" fill="#ffffff" />
        </motion.svg>
      </div>

      {/* Left Mid-page Technical Curvature */}
      <div className="absolute top-[62%] left-[-160px] w-[480px] h-[480px] pointer-events-none opacity-[0.07] hidden md:block">
        <motion.svg
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 460 460"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="230" cy="230" r="220" stroke="#ffffff" strokeWidth="1" strokeDasharray="8 12" />
          <circle cx="230" cy="230" r="180" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 4" />
          <line x1="50" y1="230" x2="410" y2="230" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="4 6" />
        </motion.svg>
      </div>
    </div>
  );
}
