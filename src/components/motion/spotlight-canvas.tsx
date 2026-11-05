"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export function SpotlightCanvas() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const background = useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.035), transparent 80%)`;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
      style={{ background }}
    />
  );
}
