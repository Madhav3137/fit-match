"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Container } from "../layout/container";
import { UserCheck, Link2, Sparkles, LucideIcon } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";
import { MaskedHeading } from "../motion/masked-text";

interface StepItem {
  num: string;
  icon: LucideIcon;
  title: string;
  description: string;
  meta: string;
}

function StepCard({ step, idx }: { step: StepItem; idx: number }) {
  const Icon = step.icon;

  // 3D Perspective Card Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: idx * 0.18, ease: TRANSITION_EASE }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-8 rounded-2xl border border-[#242424] bg-[#0c0c0c]/85 backdrop-blur-sm hover:border-neutral-500 transition-colors duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
    >
      {/* Subtle top edge traveling glow sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Background card spotlight on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-8">
          <span className="text-3xl font-mono font-bold text-white/25 group-hover:text-white transition-colors duration-300">
            {step.num}
          </span>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="p-3.5 rounded-xl border border-[#2a2a2a] bg-[#141414] text-white shadow-sm group-hover:border-neutral-400 group-hover:bg-[#1a1a1a] transition-colors"
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        </div>

        <h3 className="text-lg font-semibold text-white tracking-tight mb-3">
          {step.title}
        </h3>

        <p className="text-xs text-[#8e8e8e] leading-relaxed mb-8">
          {step.description}
        </p>
      </div>

      <div className="pt-4 border-t border-[#1a1a1a] text-[10px] font-mono text-[#555] tracking-technical group-hover:text-[#777] transition-colors">
        {step.meta}
      </div>
    </motion.div>
  );
}

export function StepFlow() {
  const steps: StepItem[] = [
    {
      num: "01",
      icon: UserCheck,
      title: "Universal Body Profile",
      description:
        "Input height, chest, waist, and optional dimensions once. Saved locally or in your account in normalized centimeters.",
      meta: "ONE-TIME SETUP // ZERO GENDER ASSUMPTIONS",
    },
    {
      num: "02",
      icon: Link2,
      title: "Paste Any Product Link",
      description:
        "Submit a clothing URL. Our server identifies the retailer, garment type, and resolves product-specific size charts.",
      meta: "SERVER EVALUATED // JSON-LD EXTRACTED",
    },
    {
      num: "03",
      icon: Sparkles,
      title: "Deterministic Fit Guidance",
      description:
        "The engine applies category weights and range-penalty algorithms to output your recommended size and trade-offs.",
      meta: "CONFIDENCE SCORED // NO MOCKED DATA",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-28 bg-transparent relative overflow-hidden">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono tracking-technical text-[#888] uppercase"
          >
            // OPERATIONAL FLOW
          </motion.div>

          <MaskedHeading
            as="h2"
            className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white uppercase justify-center"
          >
            Precision in Three Movements
          </MaskedHeading>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-sm text-[#888] leading-relaxed max-w-lg mx-auto"
          >
            Eliminating sizing ambiguity through standardized measurement semantics and real
            retailer specification mapping.
          </motion.p>
        </div>

        {/* Steps Grid with Animated Connecting Laser Flow Line */}
        <div className="relative">
          {/* Animated Connecting SVG Line connecting step 01, 02, and 03 */}
          <div className="hidden md:block absolute top-[52px] left-16 right-16 h-[2px] pointer-events-none z-0">
            <svg width="100%" height="2" className="overflow-visible">
              <line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="#2a2a2a"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
              <motion.line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeDasharray="16 80"
                animate={{ strokeDashoffset: [0, -192] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <StepCard key={step.num} step={step} idx={idx} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
