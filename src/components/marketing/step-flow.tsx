"use client";

import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { UserCheck, Link2, Sparkles } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

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
    <section id="how-it-works" className="py-28 bg-[#080808]">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
            // OPERATIONAL FLOW
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
            Precision in Three Movements
          </h2>
          <p className="text-sm text-[#888] leading-relaxed">
            Eliminating sizing ambiguity through standardized measurement semantics and real
            retailer specification mapping.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: TRANSITION_EASE }}
                className="group relative p-8 rounded-2xl border border-[#262626] bg-[#0e0e0e] hover:border-neutral-500 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-2xl font-mono font-bold text-white/30 group-hover:text-white transition-colors">
                      {step.num}
                    </span>
                    <div className="p-3 rounded-lg border border-[#303030] bg-[#141414] text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white tracking-tight mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#8e8e8e] leading-relaxed mb-8">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1e1e1e] text-[10px] font-mono text-[#555] tracking-technical">
                  {step.meta}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
