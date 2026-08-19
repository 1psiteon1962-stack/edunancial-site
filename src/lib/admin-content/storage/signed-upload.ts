import { createClient } from "@supabase/supabase-js";

import { DEFAULT_STORAGE_PREFIX } from "@/lib/admin-content/config";
import { prepareAdminUploadStorageRuntime } from "@/lib/admin-content/storage/runtime";

/**
 * Create a browser-safe signed upload URL using Supabase's supported SDK.
 * The service-role credential is used only on the server and is never returned.
 */
export async function createAdminSignedUploadUrl(storagePath: string): Promise<string | null> {
  const runtime = prepareAdminUploadStorageRuntime();
  if (!runtime.supabaseUrl || !runtime.serviceRoleKey) return null;

  const objectPath = `${DEFAULT_STORAGE_PREFIX}/${storagePath}`;
  const supabase = createClient(runtime.supabaseUrl, runtime.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await supabase.storage
    .from(runtime.bucket)
    .createSignedUploadUrl(objectPath, { upsert: true });

  if (error) {
    throw new Error(`Supabase could not create a signed upload URL: ${error.message}`);
  }

  return data?.signedUrl?.trim() || null;
}
