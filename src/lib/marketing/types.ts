export const MARKETING_PLATFORMS = ['linkedin', 'x', 'instagram', 'tiktok', 'youtube'] as const;
export type MarketingPlatform = (typeof MARKETING_PLATFORMS)[number];

export type PublicationStatus =
  | 'draft' | 'review' | 'approved' | 'scheduled'
  | 'publishing' | 'published' | 'failed' | 'cancelled';

export interface PublishRequest {
  publicationId: string;
  platform: MarketingPlatform;
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
