import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/storage/analysis-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const analysis = getAnalysis(id);

    if (!analysis) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Analysis record not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: error.message || "Failed to load analysis." } },
      { status: 500 }
    );
  }
}
