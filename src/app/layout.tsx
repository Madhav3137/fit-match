import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LuxuryCursor } from "@/components/motion/luxury-cursor";
import { SpotlightCanvas } from "@/components/motion/spotlight-canvas";
import { CinematicIntro } from "@/components/motion/cinematic-intro";
import { ThreeSceneBackground } from "@/components/motion/three-scene-background";
import { ContinuousBackground } from "@/components/motion/continuous-background";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FITMATCH — Precision Sizing Instrument",
  description:
    "One universal size profile. Multiple brands. Deterministic, product-specific size recommendations.",
  keywords: [
    "sizing",
    "fashion tech",
    "size recommendation",
    "fit matcher",
    "clothing dimensions",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoniModa.variable} ${manrope.variable} font-body`}>
      <body className="min-h-screen bg-[#080808] text-[#f5f5f5] antialiased selection:bg-neutral-800 selection:text-white relative">
        <SmoothScroll>
          <CinematicIntro />
          <ThreeSceneBackground />
          <ContinuousBackground />
          <SpotlightCanvas />
          <LuxuryCursor />
          <SiteHeader />
          <main className="min-h-screen flex flex-col relative z-10">{children}</main>
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
