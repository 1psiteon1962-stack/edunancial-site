export const SOCIAL_VIDEO_PLATFORMS = [
  "linkedin", "facebook", "instagram", "x", "tiktok", "youtube",
] as const;

export type SocialVideoPlatform = (typeof SOCIAL_VIDEO_PLATFORMS)[number];

export type ApprovedVideoPublication = {
  publicationJobId: string;
  projectId: string;
  assetId: string;
  assetSha256: string;
  assetUrl: string;
  platform: SocialVideoPlatform;
  socialAccountId: string;
  caption?: string | null;
  title?: string | null;
  metadata: Record<string, unknown>;
};

export type PublishResult = {
  remotePostId: string;
  remoteUrl?: string | null;
};

export interface SocialVideoPublisher {
  readonly platform: SocialVideoPlatform;
  verifyConnection(accountId: string): Promise<void>;
  publishApprovedVideo(input: ApprovedVideoPublication): Promise<PublishResult>;
}

const publishers = new Map<SocialVideoPlatform, SocialVideoPublisher>();

export function registerSocialVideoPublisher(publisher: SocialVideoPublisher) {
  publishers.set(publisher.platform, publisher);
}

export function getSocialVideoPublisher(platform: string): SocialVideoPublisher {
  if (!(SOCIAL_VIDEO_PLATFORMS as readonly string[]).includes(platform)) {
    throw new Error(`Unsupported social video platform: ${platform}`);
  }
  const publisher = publishers.get(platform as SocialVideoPlatform);
  if (!publisher) throw new Error(`No connected publishing adapter for ${platform}`);
  return publisher;
}

// Provider credentials never belong in this contract. Adapters resolve their
// server-side secret_ref from marketing_social_accounts after approval.
