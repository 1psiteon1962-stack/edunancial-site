import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireVideoStorageConfig, type VideoStorageConfig } from "./storage";

export function createVideoStorageClient(config: VideoStorageConfig = requireVideoStorageConfig()): S3Client {
  const options: S3ClientConfig = {
    region: "auto",
    endpoint: config.endpoint,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  };
  return new S3Client(options);
}

function requireVideoSignedUrlExpiry(expiresIn: number): number {
  if (!Number.isInteger(expiresIn) || expiresIn < 60 || expiresIn > 3600) {
    throw new Error("Video signed URL expiry must be between 60 and 3600 seconds.");
  }
  return expiresIn;
}

export async function verifyVideoObject(
  key: string,
  expectedBytes?: number,
  client: S3Client = createVideoStorageClient(),
  config: VideoStorageConfig = requireVideoStorageConfig(),
): Promise<{ byteSize: number; contentType?: string; etag?: string }> {
  const result = await client.send(new HeadObjectCommand({ Bucket: config.bucket, Key: key }));
  const byteSize = Number(result.ContentLength ?? 0);
  if (expectedBytes !== undefined && byteSize !== expectedBytes) throw new Error(`Video object size mismatch for ${key}.`);
  return { byteSize, contentType: result.ContentType, etag: result.ETag };
}

export async function presignVideoUpload(
  key: string,
  contentType: string,
  expiresIn = 900,
  client?: S3Client,
  config: VideoStorageConfig = requireVideoStorageConfig(),
): Promise<string> {
  const storageClient = client ?? createVideoStorageClient(config);
  return getSignedUrl(
    storageClient,
    new PutObjectCommand({ Bucket: config.bucket, Key: key, ContentType: contentType }),
    { expiresIn: requireVideoSignedUrlExpiry(expiresIn) },
  );
}

export async function presignVideoDownload(
  key: string,
  expiresIn = 900,
  client?: S3Client,
  config: VideoStorageConfig = requireVideoStorageConfig(),
): Promise<string> {
  const storageClient = client ?? createVideoStorageClient(config);
  return getSignedUrl(
    storageClient,
    new GetObjectCommand({ Bucket: config.bucket, Key: key }),
    { expiresIn: requireVideoSignedUrlExpiry(expiresIn) },
  );
}
