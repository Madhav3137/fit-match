import { NextRequest, NextResponse } from "next/server";
import { MeasurementProfileSchema } from "@/lib/validation/profile-schema";

// In-memory session store for server-side persistence in local development
const memoryStore = new Map<string, any>();

export async function GET(req: NextRequest) {
  try {
    const profileId = req.headers.get("x-profile-id") || "default_guest";
    const profile = memoryStore.get(profileId) || null;
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to retrieve profile." } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = MeasurementProfileSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_MEASUREMENTS",
            message: "Validation failed for supplied measurements.",
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const validatedData = parseResult.data;
    const profileId = validatedData.id || `prof_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const record = {
      ...validatedData,
      id: profileId,
      updatedAt: new Date().toISOString(),
    };

    memoryStore.set(profileId, record);
    memoryStore.set("default_guest", record);

    return NextResponse.json({ profile: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to process profile data." } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const profileId = req.headers.get("x-profile-id") || "default_guest";
    memoryStore.delete(profileId);
    memoryStore.delete("default_guest");
    return NextResponse.json({ success: true, message: "Profile successfully deleted." });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to delete profile." } },
      { status: 500 }
    );
  }
}

