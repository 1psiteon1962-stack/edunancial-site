import { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
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


export async function probeVideoStorageAccess(
  client?: S3Client,
  config: VideoStorageConfig = requireVideoStorageConfig(),
): Promise<{ bucket: string; accessible: true }> {
  const storageClient = client ?? createVideoStorageClient(config);
  await storageClient.send(new ListObjectsV2Command({ Bucket: config.bucket, MaxKeys: 1 }));
  return { bucket: config.bucket, accessible: true };
}


export async function putVideoObject(
  key: string,
  body: Uint8Array,
  contentType: string,
  client?: S3Client,
  config: VideoStorageConfig = requireVideoStorageConfig(),
): Promise<{ key: string; byteSize: number }> {
  const storageClient = client ?? createVideoStorageClient(config);
  await storageClient.send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));
  return { key, byteSize: body.byteLength };
}


export async function openVideoObject(
  key: string,
  client?: S3Client,
  config: VideoStorageConfig = requireVideoStorageConfig(),
): Promise<{ stream: ReadableStream<Uint8Array>; contentType: string; contentLength?: number }> {
  const storageClient = client ?? createVideoStorageClient(config);
  const result = await storageClient.send(new GetObjectCommand({ Bucket: config.bucket, Key: key }));
  const body = result.Body as { transformToWebStream?: () => ReadableStream<Uint8Array> } | undefined;
  if (!body?.transformToWebStream) throw new Error("Video object stream is unavailable.");
  const contentLength = result.ContentLength === undefined ? undefined : Number(result.ContentLength);
  return {
    stream: body.transformToWebStream(),
    contentType: result.ContentType || "application/octet-stream",
    contentLength: Number.isFinite(contentLength) ? contentLength : undefined,
  };
}
