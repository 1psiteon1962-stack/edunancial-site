import { NextResponse } from "next/server";

import { withApiHeaders } from "@/lib/api/security";
import { isAdminProtectionEnabled } from "@/lib/auth/require-admin";
import { validateSquareConfig } from "@/lib/square";

export async function GET() {
  return withApiHeaders(
    NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      checks: {
        adminProtectionConfigured: isAdminProtectionEnabled(),
        squareConfigured: validateSquareConfig(),
        cmsConfigured: Boolean(
          process.env.CMS_BASE_URL || process.env.STRAPI_API_URL
        ),
        contentGraphConfigured: Boolean(process.env.HYGRAPH_ENDPOINT),
      },
    })
  );
}
