import type { MarketingPlatform } from './types';

export type PlatformCapabilities = {
  text?: boolean; images?: boolean; video?: boolean; shortVideo?: boolean;
  longVideo?: boolean; links?: boolean; scheduling?: boolean; analytics?: boolean;
};

export type MarketingPlatformDefinition = {
  key: MarketingPlatform;
  displayName: string;
  capabilities: PlatformCapabilities;
};

export const CORE_MARKETING_PLATFORMS: readonly MarketingPlatformDefinition[] = [
  { key: 'linkedin', displayName: 'LinkedIn', capabilities: { text:true, images:true, video:true, links:true, scheduling:true, analytics:true } },
  { key: 'facebook', displayName: 'Facebook', capabilities: { text:true, images:true, video:true, shortVideo:true, links:true, scheduling:true, analytics:true } },
  { key: 'x', displayName: 'X', capabilities: { text:true, images:true, video:true, links:true, scheduling:true, analytics:true } },
  { key: 'instagram', displayName: 'Instagram', capabilities: { images:true, video:true, shortVideo:true, scheduling:true, analytics:true } },
  { key: 'tiktok', displayName: 'TikTok', capabilities: { video:true, shortVideo:true, scheduling:true, analytics:true } },
  { key: 'youtube', displayName: 'YouTube', capabilities: { video:true, shortVideo:true, longVideo:true, scheduling:true, analytics:true } },
] as const;
