"use client";

import { motion } from "framer-motion";
import { TRANSITION_EASE } from "@/lib/motion/variants";

interface MaskedHeadingProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  wrap?: boolean;
  mode?: "words" | "characters";
}

export function MaskedHeading({
  children,
  className = "",
  delay = 0,
  as: Component = "h2",
  wrap = true,
  mode = "words",
}: MaskedHeadingProps) {
  const words = children.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: mode === "characters" ? 0.022 : 0.06,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      y: "115%",
      opacity: 0,
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.85,
        ease: TRANSITION_EASE,
      },
    },
  };

  return (
    <Component
      className={`overflow-visible inline-flex ${
        wrap ? "flex-wrap" : "flex-nowrap"
      } gap-x-[0.28em] ${className}`}
    >
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px" }}
        className={`inline-flex ${
          wrap ? "flex-wrap" : "flex-nowrap"
        } gap-x-[0.28em] w-full`}
      >
        {mode === "characters"
          ? words.map((word, wordIdx) => (
              <span
                key={wordIdx}
                className="inline-flex overflow-hidden py-2 px-0.5 whitespace-nowrap"
              >
                {word.split("").map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    variants={child}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))
          : words.map((word, idx) => (
              <span key={idx} className="overflow-hidden inline-block py-2 px-0.5">
                <motion.span variants={child} className="inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
      </motion.span>
    </Component>
  );
}
