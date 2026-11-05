import { Container } from "@/components/layout/container";
import { ProfileForm } from "@/components/profile/profile-form";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Universal Size Profile — FITMATCH",
  description:
    "Calibrate your universal measurement profile. Input height, chest, waist, and optional dimensions for cross-brand translation.",
};

export default function ProfilePage() {
  return (
    <div className="flex-1 pt-32 pb-24 bg-[#080808]">
      <Container>
        {/* Navigation & Breadcrumb Header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#202020]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#888] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO OVERVIEW</span>
          </Link>

          <Link href="/analyze">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <span>Continue to Product Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Page Title & Explanation */}
        <div className="max-w-2xl mb-12 space-y-2">
          <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
            // PROFILE CALIBRATION
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-medium tracking-tight text-white uppercase leading-tight">
            Universal Size Profile
          </h1>
          <p className="text-sm text-[#8e8e8e] leading-relaxed">
            Enter your physical measurements once. FITMATCH calculates product-level ease and
            translates your dimensions into accurate garment sizes across all supported brands.
          </p>
        </div>

        {/* The Full Profile Form Matrix */}
        <ProfileForm />
      </Container>
    </div>
  );
}
