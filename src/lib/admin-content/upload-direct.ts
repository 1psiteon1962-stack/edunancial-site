import { DEFAULT_STORAGE_PREFIX } from "@/lib/admin-content/config";

export type DirectUploadSpec = {
  url: string;
  method: "POST";
  headers: Record<string, string>;
  bucket: string;
  storagePath: string;
};

export function createDirectUploadSpec(
  supabaseUrl: string,
  anonKey: string,
  bucket: string,
  storagePath: string,
): DirectUploadSpec {
  const normalizedBaseUrl = supabaseUrl.replace(/\/+$/, "");
  const objectPath = `${DEFAULT_STORAGE_PREFIX}/${storagePath}`;
  const encodedObjectPath = objectPath.split("/").map(encodeURIComponent).join("/");
  return {
    url: `${normalizedBaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedObjectPath}`,
    method: "POST",
    headers: {
      Authorization: "Bearer " + anonKey,
      apikey: anonKey,
      "x-upsert": "true",
    },
    bucket,
    storagePath,
  };
}
