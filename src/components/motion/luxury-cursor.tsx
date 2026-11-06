"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function LuxuryCursor() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isClicking, setIsClicking] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Velocity deformation state
  const [angle, setAngle] = React.useState(0);
  const [scaleFactor, setScaleFactor] = React.useState(1);

  // Spring physics for outer trailing ring
  const springConfig = { damping: 26, stiffness: 320, mass: 0.4 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  React.useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    let prevX = -100;
    let prevY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Velocity & angle calculation for fluid cursor deformation
      const vx = e.clientX - prevX;
      const vy = e.clientY - prevY;
      const speed = Math.sqrt(vx * vx + vy * vy);

      if (speed > 1) {
        const rad = Math.atan2(vy, vx);
        setAngle(rad * (180 / Math.PI));
        setScaleFactor(Math.min(1 + speed / 65, 1.45));
      } else {
        setScaleFactor(1);
      }

      prevX = e.clientX;
      prevY = e.clientY;

      // Target detection
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Precision inner center dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Atmospheric outer ring with velocity stretching & rotation deformation */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border border-white/40"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: angle,
          scaleX: isHovered ? 1 : scaleFactor,
          scaleY: isHovered ? 1 : 1 / scaleFactor,
        }}
        animate={{
          width: isHovered ? 52 : isClicking ? 22 : 32,
          height: isHovered ? 52 : isClicking ? 22 : 32,
          backgroundColor: isHovered
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0)",
          borderColor: isHovered
            ? "rgba(255, 255, 255, 0.85)"
            : "rgba(255, 255, 255, 0.35)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </>
  );
}
