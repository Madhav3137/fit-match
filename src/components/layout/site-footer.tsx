import Link from "next/link";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#303030] bg-[#080808] text-[#929292] py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#202020]">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-[0.24em] uppercase text-white">
                FITMATCH
              </span>
              <span className="text-[10px] font-mono text-[#626262]">v1.0.0</span>
            </div>
            <p className="text-xs text-[#929292] max-w-sm leading-relaxed">
              Precision fashion-tech sizing instrument. One universal measurement profile.
              Deterministic brand and product-specific fit recommendations.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#626262] tracking-technical">
              PARSED SERVER-SIDE // PRIVACY PRESERVED
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[11px] font-mono tracking-technical text-white uppercase">
              Application
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Size Profile
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-white transition-colors">
                  Analyze Product
                </Link>
              </li>
              <li>
                <Link href="/#retailers" className="hover:text-white transition-colors">
                  Supported Brands
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="text-[11px] font-mono tracking-technical text-white uppercase">
              Integrity
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#chapter-synthesis" className="hover:text-white transition-colors">
                  Matching Engine
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Chart Provenance
                </Link>
              </li>
              <li>
                <span className="text-[#626262]">No Fabricated Data</span>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11px] font-mono tracking-technical text-white uppercase">
              Fit Disclaimer
            </div>
            <p className="text-[11px] text-[#707070] leading-relaxed">
              FITMATCH recommendations are mathematical estimates based on body measurements and
              available retailer sizing charts. Recommendations do not constitute guaranteed fit.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#626262] gap-4">
          <div>© {new Date().getFullYear()} FITMATCH TECHNOLOGIES. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-6">
            <span>MONOCHROME ARCHITECTURE</span>
            <span>SSR SAFE</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

