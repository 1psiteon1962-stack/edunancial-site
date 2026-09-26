export type VideoStorageConfig = {
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export function readVideoStorageConfig(env: Readonly<Record<string, string | undefined>> = process.env): VideoStorageConfig | null {
  const endpoint = env.VIDEO_R2_ENDPOINT?.trim();
  const bucket = env.VIDEO_R2_BUCKET?.trim();
  const accessKeyId = env.VIDEO_R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = env.VIDEO_R2_SECRET_ACCESS_KEY?.trim();
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) return null;
  return { endpoint, bucket, accessKeyId, secretAccessKey };
}

export function requireVideoStorageConfig(env: Readonly<Record<string, string | undefined>> = process.env): VideoStorageConfig {
  const config = readVideoStorageConfig(env);
  if (!config) throw new Error("Video R2 storage is not configured.");
  return config;
}

function cleanExtension(value: string): string {
  const ext = value.trim().toLowerCase().replace(/^\./u, "");
  if (!/^[a-z0-9]{1,10}$/u.test(ext)) throw new Error("Invalid media extension.");
  return ext;
}

export function videoSourceKey(projectId: string, assetId: string, extension: string): string {
  return `v1/projects/${projectId}/sources/${assetId}.${cleanExtension(extension)}`;
}

export function videoNarrationKey(projectId: string, assetId: string, extension: string): string {
  return `v1/projects/${projectId}/narration/${assetId}.${cleanExtension(extension)}`;
}

export function videoMusicKey(projectId: string, assetId: string, extension: string): string {
  return `v1/projects/${projectId}/music/${assetId}.${cleanExtension(extension)}`;
}

export function videoMasterKey(jobId: string, leaseToken: string): string {
  return `v1/renders/${jobId}/${leaseToken}/master.mp4`;
}

export function videoThumbnailKey(jobId: string, leaseToken: string): string {
  return `v1/renders/${jobId}/${leaseToken}/thumb.jpg`;
}
