"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { MaskedHeading } from "../motion/masked-text";
import { Magnetic } from "../motion/magnetic-button";
import { ArrowRight, Sparkles } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

export function ClosingCTA() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const spotX = useTransform(smoothMouseX, [0, 1], ["20%", "80%"]);
  const spotY = useTransform(smoothMouseY, [0, 1], ["20%", "80%"]);

  const orbitalRotate = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const orbitalScale = useTransform(scrollYProgress, [0, 0.6, 1], [0.85, 1.1, 1]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [360, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative py-16 sm:py-24 bg-transparent overflow-hidden border-t border-[#181818]"
    >
      {/* Background 3D Orbital Vortex Rings */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] pointer-events-none opacity-[0.11] select-none"
      >
        <motion.svg
          style={{ rotate: orbitalRotate, scale: orbitalScale }}
          viewBox="0 0 760 760"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="380" cy="380" r="370" stroke="#ffffff" strokeWidth="1" strokeDasharray="8 12" />
          <circle cx="380" cy="380" r="300" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 6" />
          <circle cx="380" cy="380" r="230" stroke="#ffffff" strokeWidth="0.5" />
          <line x1="380" y1="10" x2="380" y2="750" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="10" y1="380" x2="750" y2="380" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="380" cy="10" r="3.5" fill="#ffffff" />
          <circle cx="380" cy="750" r="3.5" fill="#ffffff" />
          <circle cx="10" cy="380" r="3.5" fill="#ffffff" />
          <circle cx="750" cy="380" r="3.5" fill="#ffffff" />
        </motion.svg>
      </div>

      {/* Mouse-following spotlight field */}
      <motion.div
        aria-hidden="true"
        style={{ left: spotX, top: spotY }}
        className="absolute w-[500px] h-[500px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10"
      />

      <Container>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          {/* Chapter Milestone Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: TRANSITION_EASE }}
            className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-neutral-800 bg-[#121212]/90 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase">
              UNIVERSAL ENGINE // INITIATION
            </span>
          </motion.div>

          {/* Masked Bodoni Headlines */}
          <div className="space-y-1 sm:space-y-2">
            <div>
              <MaskedHeading
                as="h2"
                delay={0.1}
                wrap={true}
                mode="characters"
                className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-medium tracking-tight text-white uppercase leading-[1.1] justify-center"
              >
                YOUR NEXT PURCHASE.
              </MaskedHeading>
            </div>
            <div>
              <MaskedHeading
                as="h2"
                delay={0.25}
                wrap={true}
                mode="characters"
                className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-normal tracking-tight text-[#888888] uppercase leading-[1.1] justify-center"
              >
                A BETTER FIT.
              </MaskedHeading>
            </div>
          </div>

          {/* Editorial Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: TRANSITION_EASE }}
            className="text-base sm:text-lg text-[#999999] max-w-xl mx-auto leading-relaxed font-normal"
          >
            Your measurements. Every brand. One universal profile.
          </motion.p>

          {/* Centered CTA with Animated Surrounding 3D Ring */}
          <div className="relative pt-6 flex flex-col items-center justify-center">
            {/* Animated 3D Ring Surrounding the CTA button */}
            <motion.div
              style={{ rotate: ringRotate }}
              aria-hidden="true"
              className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed border-white/25 pointer-events-none -z-10 animate-[pulse_4s_easeInOut_infinite]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.55, ease: TRANSITION_EASE }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10"
            >
              <Magnetic strength={0.3}>
                <Link href="/profile">
                  <Button size="lg" className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-8 shadow-2xl">
                    <span>BUILD YOUR FIT PROFILE</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </Magnetic>

              <Magnetic strength={0.2}>
                <Link href="/analyze">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Paste Garment Link
                  </Button>
                </Link>
              </Magnetic>
            </motion.div>
          </div>

          {/* Technical System Status Ticks */}
          <div className="pt-8 flex items-center justify-center gap-6 text-[10px] font-mono text-[#555] uppercase tracking-wider">
            <span>METRIC PRECISION</span>
            <span>•</span>
            <span>CROSS-BRAND NORMALIZED</span>
            <span>•</span>
            <span>PRIVACY COMPLIANT</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
