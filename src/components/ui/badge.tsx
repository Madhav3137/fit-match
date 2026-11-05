import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "active" | "beta" | "outline" | "subtle";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "border-[#303030] bg-[#151515] text-[#929292]",
    active: "border-neutral-500 bg-white/5 text-white",
    beta: "border-neutral-700 bg-white/[0.03] text-neutral-300",
    outline: "border-[#303030] text-[#929292] bg-transparent",
    subtle: "border-transparent bg-white/[0.04] text-[#929292]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono tracking-technical uppercase rounded-full border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

