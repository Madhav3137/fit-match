"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStoredProfile } from "@/lib/storage/profile-storage";
import { MeasurementProfileData } from "@/lib/validation/profile-schema";
import { formatMeasurement } from "@/lib/units/converter";
import {
  UserCheck,
  History,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";

interface RecentAnalysisItem {
  analysisId: string;
  title: string;
  brand: string;
  recommendedSize: string;
  confidence: "high" | "medium" | "low";
  date: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = React.useState<MeasurementProfileData | null>(null);
  const [recentAnalyses, setRecentAnalyses] = React.useState<RecentAnalysisItem[]>([]);

  React.useEffect(() => {
    // Load local profile
    const p = getStoredProfile();
    setProfile(p);

    // Load recent analyses from localStorage
    try {
      const stored = localStorage.getItem("fitmatch_recent_analyses");
      if (stored) {
        setRecentAnalyses(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read recent analyses", e);
    }
  }, []);

  return (
    <div className="flex-1 pt-32 pb-24 bg-[#080808]">
      <Container>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-10 border-b border-[#202020] gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
              // USER DASHBOARD
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-0.5">
              Profile & Analysis Hub
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/analyze">
              <Button size="sm" className="flex items-center gap-2">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Garment Link</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Universal Profile Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl border border-[#2e2e2e] bg-[#101010] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Universal Profile
                  </span>
                </div>
                <Badge variant={profile ? "active" : "outline"}>
                  {profile ? "CALIBRATED" : "NOT SET"}
                </Badge>
              </div>

              {profile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl border border-[#222] bg-[#141414]">
                      <span className="text-[10px] text-[#666] uppercase block">Height</span>
                      <span className="text-white font-semibold">
                        {formatMeasurement(profile.heightCm, "cm")}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-[#222] bg-[#141414]">
                      <span className="text-[10px] text-[#666] uppercase block">Chest / Bust</span>
                      <span className="text-white font-semibold">
                        {formatMeasurement(profile.chestCm || undefined, "cm")}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-[#222] bg-[#141414]">
                      <span className="text-[10px] text-[#666] uppercase block">Waist</span>
                      <span className="text-white font-semibold">
                        {formatMeasurement(profile.waistCm, "cm")}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-[#222] bg-[#141414]">
                      <span className="text-[10px] text-[#666] uppercase block">Hips</span>
                      <span className="text-white font-semibold">
                        {formatMeasurement(profile.hipCm || undefined, "cm")}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-[#222] bg-[#141414]">
                      <span className="text-[10px] text-[#666] uppercase block">Shoulders</span>
                      <span className="text-white font-semibold">
                        {formatMeasurement(profile.shoulderCm || undefined, "cm")}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-[#222] bg-[#141414]">
                      <span className="text-[10px] text-[#666] uppercase block">Inseam</span>
                      <span className="text-white font-semibold">
                        {formatMeasurement(profile.inseamCm || undefined, "cm")}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-[#222] bg-[#141414] flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-[#666] uppercase">Fit Preference</span>
                    <span className="text-white uppercase font-bold">
                      {profile.fitPreference || "Regular"}
                    </span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Link href="/profile">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Profile Dimensions
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-[#303030] text-center space-y-3">
                  <p className="text-xs text-[#888] leading-relaxed">
                    No universal measurement profile has been recorded in this browser session.
                  </p>
                  <Link href="/profile">
                    <Button variant="primary" size="sm">
                      Create Size Profile
                    </Button>
                  </Link>
                </div>
              )}

              <div className="pt-4 border-t border-[#1e1e1e] flex items-center gap-2 text-[10px] font-mono text-[#666]">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>END-TO-END CLIENT ENCRYPTED STORAGE</span>
              </div>
            </div>
          </div>

          {/* Right Column: Past Analyses History */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-3xl border border-[#2e2e2e] bg-[#101010] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Saved Analyses History
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#666]">
                  {recentAnalyses.length} ITEMS STORED
                </span>
              </div>

              {recentAnalyses.length > 0 ? (
                <div className="divide-y divide-[#1e1e1e]">
                  {recentAnalyses.map((item) => (
                    <div
                      key={item.analysisId}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#888] uppercase">
                            {item.brand}
                          </span>
                          <span className="text-[10px] text-[#555] font-mono">• {item.date}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white tracking-tight group-hover:text-neutral-300 transition-colors">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-[#666] block uppercase">
                            Fit Size
                          </span>
                          <span className="text-lg font-bold font-mono text-white">
                            {item.recommendedSize}
                          </span>
                        </div>

                        <Link href={`/result/${item.analysisId}`}>
                          <button
                            type="button"
                            className="p-2 rounded-lg border border-[#2a2a2a] bg-[#141414] text-[#888] hover:text-white hover:border-neutral-500 transition-colors"
                            title="Inspect recommendation"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-[#282828] text-center space-y-3">
                  <p className="text-xs text-[#888] leading-relaxed">
                    No past analyses found. Submit any fashion product URL to view brand-specific
                    sizing recommendations.
                  </p>
                  <Link href="/analyze">
                    <Button variant="secondary" size="sm">
                      Analyze a Product
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
