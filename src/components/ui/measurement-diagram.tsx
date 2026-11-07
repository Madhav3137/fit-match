"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TRANSITION_EASE } from "@/lib/motion/variants";

interface MeasurementDiagramProps {
  activeDimension?: "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam" | null;
  className?: string;
  interactive?: boolean;
  onSelectDimension?: (dim: "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam") => void;
  currentValues?: {
    height?: number | string;
    chest?: number | string;
    waist?: number | string;
    hip?: number | string;
    shoulder?: number | string;
    inseam?: number | string;
  };
  unit?: string;
}

export function MeasurementDiagram({
  activeDimension = null,
  className = "",
  interactive = true,
  onSelectDimension,
  currentValues,
  unit = "cm",
}: MeasurementDiagramProps) {
  const [hoveredDim, setHoveredDim] = React.useState<string | null>(null);

  const currentActive = activeDimension || hoveredDim;
  const isDimActive = (dim: string) => currentActive === dim;

  return (
    <div className={`relative flex items-center justify-center p-2 select-none ${className}`}>
      <svg
        viewBox="0 0 350 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[340px] md:max-w-[400px] h-auto overflow-visible"
        aria-label="Interactive anatomical clothing measurement caliper"
        role="img"
      >
        <defs>
          {/* Technical caliper millimeter grid */}
          <pattern id="caliper-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#181818" strokeWidth="0.5" />
          </pattern>

          {/* Subtle glow filter for active calipers */}
          <filter id="active-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Precision laser scanner gradient */}
          <linearGradient id="scanner-laser" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Scanning beam glow */}
          <linearGradient id="scanner-beam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="350" height="560" fill="url(#caliper-grid)" opacity="0.8" />

        {/* Outer technical caliper framing */}
        <g opacity="0.6">
          <line x1="20" y1="20" x2="330" y2="20" stroke="#262626" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="20" y1="540" x2="330" y2="540" stroke="#262626" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="20" y1="20" x2="20" y2="540" stroke="#262626" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="330" y1="20" x2="330" y2="540" stroke="#262626" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        {/* ======================================================= */}
        {/* SUBTLE SCANNING LASER LINE (Moves continuously vertically)*/}
        {/* ======================================================= */}
        <g pointerEvents="none">
          <motion.line
            x1="40"
            y1="0"
            x2="310"
            y2="0"
            stroke="url(#scanner-laser)"
            strokeWidth="1.5"
            animate={{ y: [45, 510, 45] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>

        {/* ======================================================= */}
        {/* 1. Human Body Silhouette with SVG stroke path reveal    */}
        {/* ======================================================= */}
        <g id="body-silhouette">
          {/* Head & Cranium */}
          <motion.ellipse
            cx="175"
            cy="75"
            rx="18"
            ry="25"
            stroke="#4a4a4a"
            strokeWidth="1.2"
            fill="#0c0c0c"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: TRANSITION_EASE }}
          />
          {/* Neck */}
          <motion.path
            d="M 169 99 L 169 112 M 181 99 L 181 112"
            stroke="#4a4a4a"
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          {/* Torso, Shoulders & Lower Body Silhouette */}
          <motion.path
            d="
              M 169 112
              C 155 114 130 126 122 140
              L 112 205
              C 110 220 118 225 124 225
              L 134 175
              L 138 245
              L 144 305
              L 157 322
              L 161 490
              L 172 490
              L 175 350
              L 178 490
              L 189 490
              L 193 322
              L 206 305
              L 212 245
              L 216 175
              L 226 225
              C 232 225 240 220 238 205
              L 228 140
              C 220 126 195 114 181 112
            "
            stroke="#444"
            strokeWidth="1.2"
            fill="#090909"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: TRANSITION_EASE, delay: 0.2 }}
          />
        </g>

        {/* ======================================================= */}
        {/* 2. HEIGHT Caliper                                      */}
        {/* ======================================================= */}
        <g
          className="cursor-pointer group"
          onMouseEnter={() => interactive && setHoveredDim("height")}
          onMouseLeave={() => interactive && setHoveredDim(null)}
          onClick={() => interactive && onSelectDimension?.("height")}
        >
          <motion.line
            x1="45"
            y1="50"
            x2="45"
            y2="490"
            stroke={isDimActive("height") ? "#ffffff" : "#333333"}
            strokeWidth={isDimActive("height") ? "1.8" : "1"}
            strokeDasharray={isDimActive("height") ? "none" : "4 2"}
            filter={isDimActive("height") ? "url(#active-glow)" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />
          {/* Top and Bottom Ticks */}
          <line x1="38" y1="50" x2="52" y2="50" stroke={isDimActive("height") ? "#fff" : "#444"} strokeWidth="1.2" />
          <line x1="38" y1="490" x2="52" y2="490" stroke={isDimActive("height") ? "#fff" : "#444"} strokeWidth="1.2" />

          {/* Animated anchor radar pulse */}
          <motion.circle
            cx="45"
            cy="50"
            r="4"
            stroke="#ffffff"
            strokeWidth="0.8"
            animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <text
            x="34"
            y="270"
            fill={isDimActive("height") ? "#ffffff" : "#777777"}
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="0.18em"
            transform="rotate(-90 34 270)"
            textAnchor="middle"
            className="transition-colors duration-200"
          >
            HEIGHT {currentValues?.height ? `(${currentValues.height} ${unit})` : "(CM)"}
          </text>
        </g>

        {/* ======================================================= */}
        {/* 3. SHOULDER Caliper                                    */}
        {/* ======================================================= */}
        <g
          className="cursor-pointer group"
          onMouseEnter={() => interactive && setHoveredDim("shoulder")}
          onMouseLeave={() => interactive && setHoveredDim(null)}
          onClick={() => interactive && onSelectDimension?.("shoulder")}
        >
          <motion.line
            x1="122"
            y1="140"
            x2="228"
            y2="140"
            stroke={isDimActive("shoulder") ? "#ffffff" : "#3d3d3d"}
            strokeWidth={isDimActive("shoulder") ? "1.8" : "1"}
            filter={isDimActive("shoulder") ? "url(#active-glow)" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          {/* Pulsing Measurement Anchor Points */}
          <circle cx="122" cy="140" r="3" fill={isDimActive("shoulder") ? "#fff" : "#666"} />
          <circle cx="228" cy="140" r="3" fill={isDimActive("shoulder") ? "#fff" : "#666"} />

          <motion.circle
            cx="122"
            cy="140"
            r="6"
            stroke="#ffffff"
            strokeWidth="0.6"
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="228"
            cy="140"
            r="6"
            stroke="#ffffff"
            strokeWidth="0.6"
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Guide Line Extending Outward */}
          <motion.line
            x1="228"
            y1="140"
            x2="285"
            y2="140"
            stroke={isDimActive("shoulder") ? "#fff" : "#282828"}
            strokeWidth="0.8"
            strokeDasharray="2 2"
            animate={{ strokeDashoffset: [0, -12] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <text
            x="292"
            y="143"
            fill={isDimActive("shoulder") ? "#ffffff" : "#888888"}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.14em"
            className="transition-colors duration-200"
          >
            SHOULDERS {currentValues?.shoulder ? `[${currentValues.shoulder}]` : ""}
          </text>
        </g>

        {/* ======================================================= */}
        {/* 4. CHEST / BUST Caliper                                */}
        {/* ======================================================= */}
        <g
          className="cursor-pointer group"
          onMouseEnter={() => interactive && setHoveredDim("chest")}
          onMouseLeave={() => interactive && setHoveredDim(null)}
          onClick={() => interactive && onSelectDimension?.("chest")}
        >
          <motion.ellipse
            cx="175"
            cy="178"
            rx="45"
            ry="10"
            stroke={isDimActive("chest") ? "#ffffff" : "#3d3d3d"}
            strokeWidth={isDimActive("chest") ? "1.8" : "1"}
            strokeDasharray={isDimActive("chest") ? "none" : "3 2"}
            filter={isDimActive("chest") ? "url(#active-glow)" : undefined}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
          />
          {/* Guide Line Extending Outward */}
          <motion.line
            x1="220"
            y1="178"
            x2="285"
            y2="178"
            stroke={isDimActive("chest") ? "#fff" : "#282828"}
            strokeWidth="0.8"
            strokeDasharray="2 2"
            animate={{ strokeDashoffset: [0, -12] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <text
            x="292"
            y="181"
            fill={isDimActive("chest") ? "#ffffff" : "#888888"}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.14em"
            className="transition-colors duration-200"
          >
            CHEST / BUST {currentValues?.chest ? `[${currentValues.chest}]` : ""}
          </text>
        </g>

        {/* ======================================================= */}
        {/* 5. WAIST Caliper                                       */}
        {/* ======================================================= */}
        <g
          className="cursor-pointer group"
          onMouseEnter={() => interactive && setHoveredDim("waist")}
          onMouseLeave={() => interactive && setHoveredDim(null)}
          onClick={() => interactive && onSelectDimension?.("waist")}
        >
          <motion.ellipse
            cx="175"
            cy="242"
            rx="36"
            ry="9"
            stroke={isDimActive("waist") ? "#ffffff" : "#3d3d3d"}
            strokeWidth={isDimActive("waist") ? "1.8" : "1"}
            strokeDasharray={isDimActive("waist") ? "none" : "3 2"}
            filter={isDimActive("waist") ? "url(#active-glow)" : undefined}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.8 }}
          />
          {/* Guide Line Extending Outward */}
          <motion.line
            x1="211"
            y1="242"
            x2="285"
            y2="242"
            stroke={isDimActive("waist") ? "#fff" : "#282828"}
            strokeWidth="0.8"
            strokeDasharray="2 2"
            animate={{ strokeDashoffset: [0, -12] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <text
            x="292"
            y="245"
            fill={isDimActive("waist") ? "#ffffff" : "#888888"}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.14em"
            className="transition-colors duration-200"
          >
            WAIST {currentValues?.waist ? `[${currentValues.waist}]` : ""}
          </text>
        </g>

        {/* ======================================================= */}
        {/* 6. HIPS Caliper                                        */}
        {/* ======================================================= */}
        <g
          className="cursor-pointer group"
          onMouseEnter={() => interactive && setHoveredDim("hip")}
          onMouseLeave={() => interactive && setHoveredDim(null)}
          onClick={() => interactive && onSelectDimension?.("hip")}
        >
          <motion.ellipse
            cx="175"
            cy="292"
            rx="43"
            ry="10"
            stroke={isDimActive("hip") ? "#ffffff" : "#3d3d3d"}
            strokeWidth={isDimActive("hip") ? "1.8" : "1"}
            strokeDasharray={isDimActive("hip") ? "none" : "3 2"}
            filter={isDimActive("hip") ? "url(#active-glow)" : undefined}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
          />
          {/* Guide Line Extending Outward */}
          <motion.line
            x1="218"
            y1="292"
            x2="285"
            y2="292"
            stroke={isDimActive("hip") ? "#fff" : "#282828"}
            strokeWidth="0.8"
            strokeDasharray="2 2"
            animate={{ strokeDashoffset: [0, -12] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <text
            x="292"
            y="295"
            fill={isDimActive("hip") ? "#ffffff" : "#888888"}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.14em"
            className="transition-colors duration-200"
          >
            HIPS {currentValues?.hip ? `[${currentValues.hip}]` : ""}
          </text>
        </g>

        {/* ======================================================= */}
        {/* 7. INSEAM Caliper                                      */}
        {/* ======================================================= */}
        <g
          className="cursor-pointer group"
          onMouseEnter={() => interactive && setHoveredDim("inseam")}
          onMouseLeave={() => interactive && setHoveredDim(null)}
          onClick={() => interactive && onSelectDimension?.("inseam")}
        >
          <motion.line
            x1="175"
            y1="348"
            x2="175"
            y2="485"
            stroke={isDimActive("inseam") ? "#ffffff" : "#3d3d3d"}
            strokeWidth={isDimActive("inseam") ? "1.8" : "1"}
            strokeDasharray={isDimActive("inseam") ? "none" : "3 2"}
            filter={isDimActive("inseam") ? "url(#active-glow)" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, delay: 1.0 }}
          />
          <line x1="168" y1="485" x2="182" y2="485" stroke={isDimActive("inseam") ? "#fff" : "#555"} strokeWidth="1.2" />
          <motion.line
            x1="175"
            y1="418"
            x2="285"
            y2="418"
            stroke={isDimActive("inseam") ? "#fff" : "#282828"}
            strokeWidth="0.8"
            strokeDasharray="2 2"
            animate={{ strokeDashoffset: [0, -12] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <text
            x="292"
            y="421"
            fill={isDimActive("inseam") ? "#ffffff" : "#888888"}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.14em"
            className="transition-colors duration-200"
          >
            INSEAM (CROTCH TO HEM) {currentValues?.inseam ? `[${currentValues.inseam}]` : ""}
          </text>
        </g>

        {/* Precision Crosshairs in corners */}
        <g stroke="#333" strokeWidth="1">
          <path d="M 15 25 L 25 25 M 20 20 L 20 30" />
          <path d="M 325 25 L 335 25 M 330 20 L 330 30" />
          <path d="M 15 535 L 25 535 M 20 530 L 20 540" />
          <path d="M 325 535 L 335 535 M 330 530 L 330 540" />
        </g>
      </svg>
    </div>
  );
}
