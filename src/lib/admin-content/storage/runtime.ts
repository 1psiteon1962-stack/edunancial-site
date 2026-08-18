const CANONICAL_UPLOAD_BUCKET = "uploads";

/**
 * Prepare and validate the production storage environment before any admin
 * upload operation touches Supabase Storage.
 *
 * The upload system previously had several independent fallbacks. In
 * production, one path could continue with only the anon key and later fail
 * against storage.objects RLS, while another path could fail because the
 * bucket environment variable was omitted even though the application already
 * standardizes on the `uploads` bucket in its storage migration.
 *
 * Production uploads now have one contract:
 *   - a Supabase project URL,
 *   - the server-only service-role key,
 *   - one canonical bucket (defaults to `uploads`).
 *
 * The service-role key is intentionally required. Anonymous storage writes are
 * blocked by the project's RLS policy and must never be used as a production
 * upload fallback.
 */
export function prepareAdminUploadStorageRuntime() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  const configuredBucket = (
    process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET ??
    process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY ??
    ""
  ).trim();
  const bucket = configuredBucket || CANONICAL_UPLOAD_BUCKET;

  if (process.env.NODE_ENV === "production") {
    if (!supabaseUrl) {
      throw new Error(
        "Admin upload storage is unavailable because NEXT_PUBLIC_SUPABASE_URL is not configured in production.",
      );
    }

    let parsed: URL;
    try {
      parsed = new URL(supabaseUrl);
    } catch {
      throw new Error(
        "Admin upload storage is unavailable because NEXT_PUBLIC_SUPABASE_URL is not a valid URL.",
      );
    }

    if (parsed.protocol !== "https:") {
      throw new Error(
        "Admin upload storage is unavailable because NEXT_PUBLIC_SUPABASE_URL must use HTTPS in production.",
      );
    }

    if (!serviceRoleKey) {
      throw new Error(
        "Admin upload storage is unavailable because SUPABASE_SERVICE_ROLE_KEY is not configured in production. " +
          "Anonymous storage writes are intentionally blocked by RLS.",
      );
    }
  }

  // Normalize every upload route onto the same bucket. This also preserves
  // compatibility with existing code that resolves the bucket from env vars.
  if (!configuredBucket) {
    process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET = bucket;
  }

  return {
    supabaseUrl,
    serviceRoleKey,
    bucket,
  };
}

export function getCanonicalAdminUploadBucket() {
  return CANONICAL_UPLOAD_BUCKET;
}
