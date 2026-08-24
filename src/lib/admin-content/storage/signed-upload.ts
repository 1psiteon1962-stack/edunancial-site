import { createClient } from "@supabase/supabase-js";

import { DEFAULT_STORAGE_PREFIX } from "@/lib/admin-content/config";
import { prepareAdminUploadStorageRuntime } from "@/lib/admin-content/storage/runtime";

type SignedUploadOptions = {
  bucket?: string;
  prefix?: string | null;
  upsert?: boolean;
};

/**
 * Create a browser-safe signed upload URL using Supabase's supported SDK.
 * The service-role credential is used only on the server and is never returned.
 * Optional overrides let trusted server routes target dedicated private buckets
 * without duplicating service-role upload logic.
 */
export async function createAdminSignedUploadUrl(
  storagePath: string,
  options: SignedUploadOptions = {},
): Promise<string | null> {
  const runtime = prepareAdminUploadStorageRuntime();
  if (!runtime.supabaseUrl || !runtime.serviceRoleKey) return null;

  const bucket = options.bucket?.trim() || runtime.bucket;
  const prefix = options.prefix === undefined ? DEFAULT_STORAGE_PREFIX : options.prefix;
  const objectPath = prefix ? `${prefix}/${storagePath}` : storagePath;
  const supabase = createClient(runtime.supabaseUrl, runtime.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(objectPath, { upsert: options.upsert ?? true });

  if (error) {
    throw new Error(`Supabase could not create a signed upload URL: ${error.message}`);
  }

  return data?.signedUrl?.trim() || null;
}
