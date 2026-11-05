"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TRANSITION_EASE } from "@/lib/motion/variants";

export function CinematicIntro() {
  const [showIntro, setShowIntro] = React.useState(false);

  React.useEffect(() => {
    // Only play once per session to maintain elegance
    const seen = sessionStorage.getItem("fitmatch_intro_seen");
    if (!seen) {
      setShowIntro(true);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem("fitmatch_intro_seen", "true");
    setShowIntro(false);
  };

  return (
    <AnimatePresence onExitComplete={handleComplete}>
      {showIntro && (
        <motion.div
          key="cinematic-curtain"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: TRANSITION_EASE },
          }}
          className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden"
          onClick={handleComplete}
        >
          {/* Subtle background precision grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

          {/* Center Brand Identity with Expanding Letter-spacing */}
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: TRANSITION_EASE }}
              className="text-[10px] font-mono tracking-technical text-[#666] uppercase"
            >
              // INITIALIZING FIT ENGINE
            </motion.div>

            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.25em" }}
              animate={{ opacity: 1, letterSpacing: "0.55em" }}
              transition={{ duration: 1.2, ease: TRANSITION_EASE }}
              className="text-3xl sm:text-5xl font-bold font-mono tracking-[0.55em] text-white uppercase pl-[0.55em]"
            >
              FITMATCH
            </motion.div>

            {/* Horizontal Laser Line Draw */}
            <div className="w-56 sm:w-72 h-[1px] bg-[#1a1a1a] relative overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.3, ease: "easeInOut", repeat: 0 }}
                onAnimationComplete={() => {
                  setTimeout(() => {
                    handleComplete();
                  }, 200);
                }}
                className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-[9px] font-mono text-[#555] tracking-widest uppercase pt-2"
            >
              UNIVERSAL MEASUREMENT MATRIX
            </motion.div>
          </div>

          {/* Skip cue */}
          <div className="absolute bottom-8 text-[10px] font-mono text-[#444] tracking-wider uppercase">
            CLICK OR TAP TO SKIP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

