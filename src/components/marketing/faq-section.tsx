"use client";

import * as React from "react";
import { Container } from "../layout/container";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MaskedHeading } from "../motion/masked-text";

interface FAQItem {
  q: string;
  a: string;
  meta: string;
}

const FAQS: FAQItem[] = [
  {
    q: "How does FITMATCH calculate my size without camera scanning?",
    a: "Camera-based sizing apps introduce perspective distortion, focal compression, and severe privacy hazards. FITMATCH relies on pure physical body measurements (in centimeters) mapped deterministically against product-specific sizing charts and garment tolerance models.",
    meta: "DETERMINISTIC SEMANTICS",
  },
  {
    q: "What happens if a retailer blocks automatic scraping?",
    a: "We maintain strict integrity: we never invent fake sizing data. If an anti-bot system or private structure prevents automated chart extraction, FITMATCH seamlessly presents an editorial manual entry drawer where you can enter or select the brand's published measurements.",
    meta: "FALLBACK INTEGRITY",
  },
  {
    q: "Are my body measurements stored or shared?",
    a: "Never without explicit consent. In guest mode, your measurements remain strictly in your browser session or local storage. In authenticated mode, measurements are stored with Row-Level Security in encrypted PostgreSQL. We never log body measurements in analytics.",
    meta: "PRIVACY ARCHITECTURE",
  },
  {
    q: "Why do different brands have such wildly different sizing?",
    a: "Vanity sizing, country of origin, and garment cut (e.g. boxy vs slim vs oversized) cause identical numeric labels (like 'M' or '32') to vary by up to 10 centimeters across brands. FITMATCH bypasses arbitrary labels by evaluating physical dimensions.",
    meta: "INDUSTRY VARIANCE",
  },
  {
    q: "Can I enter measurements in inches?",
    a: "Yes. Our interface offers a seamless bidirectional unit toggle. All internal calculation and database storage is normalized to precise floating-point centimeters to maintain mathematical accuracy.",
    meta: "BIDIRECTIONAL NORMALIZATION",
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-20 bg-transparent relative overflow-hidden">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
              // TECHNICAL KNOWLEDGE BASE
            </div>
            <MaskedHeading as="h2" className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white uppercase justify-center">
              Frequently Clarified
            </MaskedHeading>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-neutral-500 bg-[#121212]"
                      : "border-[#222] bg-[#0c0c0c] hover:border-[#383838]"
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <span className="text-[10px] font-mono text-[#555] tracking-technical uppercase block mb-1">
                        {faq.meta}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        {faq.q}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-1 rounded-full text-[#888]"
                    >
                      <ChevronDown className="w-4 h-4 text-[#888] shrink-0" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-1 text-xs sm:text-sm text-[#929292] leading-relaxed border-t border-[#1a1a1a]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
