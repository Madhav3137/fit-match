"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-40";

    const variantStyles = {
      primary:
        "bg-white text-black hover:bg-neutral-200 active:scale-[0.98] shadow-sm font-semibold",
      secondary:
        "bg-[#151515] text-neutral-200 border border-[#303030] hover:border-neutral-500 hover:text-white active:scale-[0.98]",
      outline:
        "bg-transparent text-neutral-300 border border-[#303030] hover:border-neutral-400 hover:text-white active:scale-[0.98]",
      ghost:
        "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs tracking-wider uppercase rounded-md",
      md: "h-11 px-5 text-sm tracking-wide rounded-lg",
      lg: "h-13 px-8 text-base tracking-wide rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
