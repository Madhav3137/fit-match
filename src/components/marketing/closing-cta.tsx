"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { MaskedHeading } from "../motion/masked-text";
import { Magnetic } from "../motion/magnetic-button";
import { ArrowRight, Sparkles } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

export function ClosingCTA() {
  const sectionRef = React.useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 bg-transparent overflow-hidden border-t border-[#181818]"
    >
      {/* Subtle Studio Depth Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.025)_0%,transparent_70%)] pointer-events-none -z-10"
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
            <span className="text-[10px] font-mono tracking-technical text-neutral-400 uppercase">
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
                className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-medium tracking-tight text-neutral-200 uppercase leading-[1.1] justify-center"
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
            className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed font-normal"
          >
            Your measurements. Every brand. One universal profile.
          </motion.p>

          {/* Centered CTA Buttons */}
          <div className="relative pt-6 flex flex-col items-center justify-center">
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
