"use client";

import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { UserCheck, Link2, Sparkles } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";
import { MaskedHeading } from "../motion/masked-text";

export function StepFlow() {
  const steps = [
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
    <section id="how-it-works" className="py-32 bg-[#080808] relative overflow-hidden">
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
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase justify-center"
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

        {/* Steps Grid with Connecting Laser Line */}
        <div className="relative">
          {/* Subtle animated connecting beam hidden on mobile */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent pointer-events-none -translate-y-12" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: idx * 0.18, ease: TRANSITION_EASE }}
                  whileHover={{ y: -5 }}
                  className="group relative p-8 rounded-2xl border border-[#242424] bg-[#0c0c0c] hover:border-neutral-500 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle top edge glow on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-3xl font-mono font-bold text-white/20 group-hover:text-white transition-colors duration-300">
                        {step.num}
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-3.5 rounded-xl border border-[#2a2a2a] bg-[#141414] text-white shadow-sm group-hover:border-neutral-500 transition-colors"
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

                  <div className="pt-4 border-t border-[#1a1a1a] text-[10px] font-mono text-[#555] tracking-technical">
                    {step.meta}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
