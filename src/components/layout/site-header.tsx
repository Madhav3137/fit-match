"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { Button } from "../ui/button";
import { Magnetic } from "../motion/magnetic-button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [hoveredNav, setHoveredNav] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Retailers", href: "/#retailers" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#080808]/90 backdrop-blur-md border-b border-[#242424] py-3.5"
          : "bg-transparent py-5"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="text-sm font-bold tracking-[0.22em] uppercase text-white group-hover:text-neutral-300 transition-colors">
              FITMATCH
            </span>
            <span className="text-[10px] font-mono tracking-technical text-[#626262] uppercase hidden sm:inline-block">
              // STUDIO
            </span>
          </Link>

          {/* Editorial Nav Links with Sliding Indicator */}
          <nav
            className="hidden md:flex items-center gap-8 relative"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onMouseEnter={() => setHoveredNav(link.name)}
                className="relative py-1 text-xs tracking-wider uppercase text-[#929292] hover:text-white transition-colors duration-150"
              >
                <span>{link.name}</span>
                {hoveredNav === link.name && (
                  <motion.div
                    layoutId="header-nav-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-white rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action with Magnetic Pull */}
          <div className="flex items-center gap-3">
            <Magnetic strength={0.2}>
              <Link href="/profile">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Build Profile
                </Button>
              </Link>
            </Magnetic>

            <Magnetic strength={0.25}>
              <Link href="/analyze">
                <Button variant="primary" size="sm">
                  Paste Link
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>
      </Container>
    </header>
  );
}
