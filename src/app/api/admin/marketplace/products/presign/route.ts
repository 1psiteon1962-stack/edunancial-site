import { NextRequest } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { assertValidUploadName, validateFileSize } from "@/lib/admin-content/security";
import { createAdminSignedUploadUrl } from "@/lib/admin-content/storage/signed-upload";
import { createId } from "@/lib/admin-content/utils";

const MARKETPLACE_BUCKET = process.env.EDUNANCIAL_MARKETPLACE_STORAGE_BUCKET?.trim() || "marketplace-products";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/epub+zip",
  "application/zip",
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

type UploadDescriptor = {
  name?: unknown;
  size?: unknown;
  type?: unknown;
  role?: unknown;
};

export async function POST(request: NextRequest) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as UploadDescriptor;
    const name = assertValidUploadName(String(body.name ?? ""));
    const size = Number(body.size ?? 0);
    const type = String(body.type ?? "").toLowerCase();
    const role = String(body.role ?? "primary").toLowerCase();

    validateFileSize(size);
    if (type && !ALLOWED_TYPES.has(type)) {
      return Response.json({ error: `Unsupported marketplace file type: ${type}` }, { status: 400 });
    }
    if (!new Set(["primary", "cover", "sample"]).has(role)) {
      return Response.json({ error: "Asset role must be primary, cover, or sample." }, { status: 400 });
    }

    const assetId = createId("marketplace");
    const storagePath = `${role}/${new Date().toISOString().slice(0, 10)}/${assetId}-${name}`;
    const signedUrl = await createAdminSignedUploadUrl(storagePath, {
      bucket: MARKETPLACE_BUCKET,
      prefix: null,
      upsert: false,
    });

    if (!signedUrl) {
      return Response.json(
        { error: "Marketplace storage is not configured for signed uploads." },
        { status: 503 },
      );
    }

    return Response.json({
      success: true,
      bucket: MARKETPLACE_BUCKET,
      storagePath,
      signedUrl,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to prepare marketplace upload." },
      { status: 400 },
    );
  }
}
