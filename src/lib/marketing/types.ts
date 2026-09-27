export const MARKETING_PLATFORMS = ['linkedin', 'facebook', 'x', 'instagram', 'tiktok', 'youtube'] as const;
export type MarketingPlatform = (typeof MARKETING_PLATFORMS)[number];

export type SocialConnectionStatus = 'pending' | 'connected' | 'reauthorization_required' | 'disabled';

export interface SocialAccount {
  id: string;
  platform: MarketingPlatform;
  provider: string;
  providerAccountId: string;
  displayName: string;
  handle?: string;
  connectionStatus: SocialConnectionStatus;
  secretRef?: string;
}

export type PublicationStatus =
  | 'draft' | 'review' | 'approved' | 'scheduled'
  | 'publishing' | 'published' | 'failed' | 'cancelled';

export interface PublishRequest {
  publicationId: string;
  platform: MarketingPlatform;
  socialAccountId?: string;
  copy: string;
  mediaRefs: string[];
  scheduledFor?: string;
}

export interface PublishResult {
  providerPublicationId: string;
  publishedAt: string;
}

export interface SocialPublisher {
  platform: MarketingPlatform;
  publish(request: PublishRequest): Promise<PublishResult>;
}
