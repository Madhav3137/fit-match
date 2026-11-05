import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#080808] text-[#f5f5f5] antialiased selection:bg-neutral-800 selection:text-white">
        <SiteHeader />
        <main className="min-h-screen flex flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

