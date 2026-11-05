"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TRANSITION_EASE } from "@/lib/motion/variants";

interface MeasurementDiagramProps {
  activeDimension?: "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam" | null;
  className?: string;
  interactive?: boolean;
  onSelectDimension?: (dim: "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam") => void;
}

export function MeasurementDiagram({
  activeDimension = null,
  className = "",
  interactive = false,
  onSelectDimension,
}: MeasurementDiagramProps) {
  const isDimActive = (dim: string) => activeDimension === dim;

  return (
    <div className={`relative flex items-center justify-center p-4 ${className}`}>
      <svg
        viewBox="0 0 340 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[320px] md:max-w-[380px] h-auto select-none overflow-visible"
        aria-label="Human body measurement diagram"
        role="img"
      >
        <defs>
          {/* Subtle grid pattern for diagram background */}
          <pattern id="diagram-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#161616" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="340" height="540" fill="url(#diagram-grid)" opacity="0.7" />

        {/* Outer technical caliper frame */}
        <line x1="20" y1="20" x2="320" y2="20" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="20" y1="520" x2="320" y2="520" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="20" y1="20" x2="20" y2="520" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="320" y1="20" x2="320" y2="520" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />

        {/* Minimalist stylized human silhouette outline */}
        <g id="body-silhouette">
          {/* Head & Neck */}
          <motion.ellipse
            cx="170"
            cy="70"
            rx="18"
            ry="24"
            stroke="#555"
            strokeWidth="1.2"
            fill="#0d0d0d"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: TRANSITION_EASE }}
          />
          <motion.path
            d="M 164 94 L 164 108 M 176 94 L 176 108"
            stroke="#555"
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          {/* Torso & Shoulders */}
          <motion.path
            d="
              M 164 108
              C 150 110 126 122 120 135
              L 110 200
              C 108 215 116 220 122 220
              L 132 170
              L 136 240
              L 142 300
              L 155 315
              L 158 480
              L 168 480
              L 170 340
              L 172 480
              L 182 480
              L 185 315
              L 198 300
              L 204 240
              L 208 170
              L 218 220
              C 224 220 232 215 230 200
              L 220 135
              C 214 122 190 110 176 108
            "
            stroke="#444"
            strokeWidth="1.2"
            fill="#0b0b0b"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: TRANSITION_EASE, delay: 0.2 }}
          />
        </g>

        {/* 1. HEIGHT Dimension Line */}
        <g
          className={`cursor-pointer transition-opacity ${interactive ? "hover:opacity-100" : ""}`}
          onClick={() => interactive && onSelectDimension?.("height")}
        >
          <motion.line
            x1="45"
            y1="46"
            x2="45"
            y2="480"
            stroke={isDimActive("height") ? "#fff" : "#383838"}
            strokeWidth={isDimActive("height") ? "1.5" : "1"}
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />
          <line x1="38" y1="46" x2="52" y2="46" stroke={isDimActive("height") ? "#fff" : "#444"} strokeWidth="1" />
          <line x1="38" y1="480" x2="52" y2="480" stroke={isDimActive("height") ? "#fff" : "#444"} strokeWidth="1" />
          <text
            x="36"
            y="265"
            fill={isDimActive("height") ? "#fff" : "#777"}
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="0.16em"
            transform="rotate(-90 36 265)"
            textAnchor="middle"
          >
            HEIGHT (CM)
          </text>
        </g>

        {/* 2. SHOULDER Dimension */}
        <g
          className={`cursor-pointer transition-opacity ${interactive ? "hover:opacity-100" : ""}`}
          onClick={() => interactive && onSelectDimension?.("shoulder")}
        >
          <motion.line
            x1="120"
            y1="135"
            x2="220"
            y2="135"
            stroke={isDimActive("shoulder") ? "#fff" : "#444"}
            strokeWidth={isDimActive("shoulder") ? "1.5" : "1"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <circle cx="120" cy="135" r="2.5" fill={isDimActive("shoulder") ? "#fff" : "#666"} />
          <circle cx="220" cy="135" r="2.5" fill={isDimActive("shoulder") ? "#fff" : "#666"} />
          {/* Guide callout right */}
          <line x1="220" y1="135" x2="275" y2="135" stroke={isDimActive("shoulder") ? "#fff" : "#2a2a2a"} strokeWidth="0.8" />
          <text
            x="280"
            y="138"
            fill={isDimActive("shoulder") ? "#fff" : "#888"}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.12em"
          >
            SHOULDER
          </text>
        </g>

        {/* 3. CHEST / BUST Dimension */}
        <g
          className={`cursor-pointer transition-opacity ${interactive ? "hover:opacity-100" : ""}`}
          onClick={() => interactive && onSelectDimension?.("chest")}
        >
          <motion.ellipse
            cx="170"
            cy="172"
            rx="42"
            ry="9"
            stroke={isDimActive("chest") ? "#fff" : "#444"}
            strokeWidth={isDimActive("chest") ? "1.5" : "1"}
            fill="none"
            strokeDasharray={isDimActive("chest") ? "none" : "3 2"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
          />
          <line x1="212" y1="172" x2="275" y2="172" stroke={isDimActive("chest") ? "#fff" : "#2a2a2a"} strokeWidth="0.8" />
          <text
            x="280"
            y="175"
            fill={isDimActive("chest") ? "#fff" : "#888"}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.12em"
          >
            CHEST / BUST
          </text>
        </g>

        {/* 4. WAIST Dimension */}
        <g
          className={`cursor-pointer transition-opacity ${interactive ? "hover:opacity-100" : ""}`}
          onClick={() => interactive && onSelectDimension?.("waist")}
        >
          <motion.ellipse
            cx="170"
            cy="235"
            rx="34"
            ry="8"
            stroke={isDimActive("waist") ? "#fff" : "#444"}
            strokeWidth={isDimActive("waist") ? "1.5" : "1"}
            fill="none"
            strokeDasharray={isDimActive("waist") ? "none" : "3 2"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.8 }}
          />
          <line x1="204" y1="235" x2="275" y2="235" stroke={isDimActive("waist") ? "#fff" : "#2a2a2a"} strokeWidth="0.8" />
          <text
            x="280"
            y="238"
            fill={isDimActive("waist") ? "#fff" : "#888"}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.12em"
          >
            WAIST
          </text>
        </g>

        {/* 5. HIP Dimension */}
        <g
          className={`cursor-pointer transition-opacity ${interactive ? "hover:opacity-100" : ""}`}
          onClick={() => interactive && onSelectDimension?.("hip")}
        >
          <motion.ellipse
            cx="170"
            cy="285"
            rx="40"
            ry="9"
            stroke={isDimActive("hip") ? "#fff" : "#444"}
            strokeWidth={isDimActive("hip") ? "1.5" : "1"}
            fill="none"
            strokeDasharray={isDimActive("hip") ? "none" : "3 2"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
          />
          <line x1="210" y1="285" x2="275" y2="285" stroke={isDimActive("hip") ? "#fff" : "#2a2a2a"} strokeWidth="0.8" />
          <text
            x="280"
            y="288"
            fill={isDimActive("hip") ? "#fff" : "#888"}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.12em"
          >
            HIPS
          </text>
        </g>

        {/* 6. INSEAM Dimension */}
        <g
          className={`cursor-pointer transition-opacity ${interactive ? "hover:opacity-100" : ""}`}
          onClick={() => interactive && onSelectDimension?.("inseam")}
        >
          <motion.line
            x1="170"
            y1="340"
            x2="170"
            y2="475"
            stroke={isDimActive("inseam") ? "#fff" : "#444"}
            strokeWidth={isDimActive("inseam") ? "1.5" : "1"}
            strokeDasharray="3 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, delay: 1.0 }}
          />
          <line x1="165" y1="475" x2="175" y2="475" stroke={isDimActive("inseam") ? "#fff" : "#555"} strokeWidth="1" />
          <line x1="170" y1="410" x2="275" y2="410" stroke={isDimActive("inseam") ? "#fff" : "#2a2a2a"} strokeWidth="0.8" />
          <text
            x="280"
            y="413"
            fill={isDimActive("inseam") ? "#fff" : "#888"}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.12em"
          >
            INSEAM
          </text>
        </g>

        {/* Technical crosshairs at corners */}
        <path d="M 15 25 L 25 25 M 20 20 L 20 30" stroke="#333" strokeWidth="1" />
        <path d="M 315 25 L 325 25 M 320 20 L 320 30" stroke="#333" strokeWidth="1" />
        <path d="M 15 515 L 25 515 M 20 510 L 20 520" stroke="#333" strokeWidth="1" />
        <path d="M 315 515 L 325 515 M 320 510 L 320 520" stroke="#333" strokeWidth="1" />
      </svg>
    </div>
  );
}

