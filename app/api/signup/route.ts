import { NextRequest, NextResponse } from "next/server";
import { UserProfile } from "@/lib/types/user-profile";

export async function POST(req: NextRequest) {
  const data = await req.formData();

  const profile: UserProfile = {
    firstName: String(data.get("firstName")),
    lastName: String(data.get("lastName")),
    email: String(data.get("email")),
    phone: data.get("phone")?.toString(),

    country: String(data.get("country")),
    ageRange: data.get("ageRange") as any,

    hasBusiness: data.get("hasBusiness") === "on",
    businessName: data.get("businessName")?.toString(),
    businessJurisdiction: data.get("businessJurisdiction")?.toString(),
    businessStatus: data.get("businessStatus") as any,

    createdAt: new Date().toISOString(),
  };

  // Placeholder: store internally (DB, CRM, sheet, etc.)
  console.log("NEW SIGNUP", profile);

  return NextResponse.json({ success: true });
}
