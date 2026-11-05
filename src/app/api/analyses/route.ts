import { NextRequest, NextResponse } from "next/server";
import { getAllAnalyses } from "@/lib/storage/analysis-store";

export async function GET(req: NextRequest) {
  try {
    const list = getAllAnalyses();
    return NextResponse.json({ analyses: list }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to list analyses." } },
      { status: 500 }
    );
  }
}
