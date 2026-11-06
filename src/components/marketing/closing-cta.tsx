"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
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

  const orbitalRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const orbitalScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-36 bg-transparent overflow-hidden border-t border-[#1a1a1a]"
    >
      {/* Background Orbital Ring dedicated to Closing Chapter */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] pointer-events-none opacity-[0.08] select-none"
      >
        <motion.svg
          style={{ rotate: orbitalRotate, scale: orbitalScale }}
          viewBox="0 0 720 720"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="360" cy="360" r="350" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 10" />
          <circle cx="360" cy="360" r="290" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 6" />
          <circle cx="360" cy="360" r="220" stroke="#ffffff" strokeWidth="0.5" />
          <line x1="360" y1="10" x2="360" y2="710" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="10" y1="360" x2="710" y2="360" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="360" cy="10" r="3.5" fill="#ffffff" />
          <circle cx="360" cy="710" r="3.5" fill="#ffffff" />
          <circle cx="10" cy="360" r="3.5" fill="#ffffff" />
          <circle cx="710" cy="360" r="3.5" fill="#ffffff" />
        </motion.svg>
      </div>

      {/* Atmospheric center spotlight */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10"
      />

      <Container>
        <motion.div
          style={{ y: textY }}
          className="max-w-4xl mx-auto text-center space-y-8 relative z-10"
        >
          {/* Chapter Milestone Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: TRANSITION_EASE }}
            className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-[#262626] bg-[#0f0f0f]/80 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase">
              CHAPTER 06 // SYNTHESIS & FIT COMPLETION
            </span>
          </motion.div>

          {/* Masked Bodoni Moda Headlines */}
          <div className="space-y-1 sm:space-y-2">
            <div className="overflow-hidden">
              <MaskedHeading
                as="h2"
                delay={0.1}
                wrap={false}
                mode="characters"
                className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-[-0.02em] text-white uppercase leading-[1.05] justify-center"
              >
                YOUR NEXT PURCHASE.
              </MaskedHeading>
            </div>
            <div className="overflow-hidden">
              <MaskedHeading
                as="h2"
                delay={0.25}
                wrap={false}
                mode="characters"
                className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[-0.02em] text-[#888888] uppercase leading-[1.05] justify-center"
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

          {/* Action CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.55, ease: TRANSITION_EASE }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
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

          {/* Technical System Status Ticks */}
          <div className="pt-10 flex items-center justify-center gap-6 text-[10px] font-mono text-[#555] uppercase tracking-wider">
            <span>METRIC PRECISION</span>
            <span>•</span>
            <span>CROSS-BRAND NORMALIZED</span>
            <span>•</span>
            <span>PRIVACY COMPLIANT</span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
