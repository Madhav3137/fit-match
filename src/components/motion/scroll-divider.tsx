"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollDividerProps {
  className?: string;
}

export function ScrollDivider({ className = "" }: ScrollDividerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden h-[1px] bg-[#1a1a1a] ${className}`}>
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="h-full w-full bg-gradient-to-r from-transparent via-[#555] to-transparent"
      />
    </div>
  );
}

