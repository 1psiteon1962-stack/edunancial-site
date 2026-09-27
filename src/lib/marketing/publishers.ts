import type { MarketingPlatform, PublishRequest, PublishResult, SocialPublisher } from './types';

export class UnconfiguredPublisher implements SocialPublisher {
  constructor(public readonly platform: MarketingPlatform) {}

  async publish(_request: PublishRequest): Promise<PublishResult> {
    throw new Error(`Marketing publisher for ${this.platform} is not configured. Connect the authorized provider before publishing.`);
  }
}

export function publisherFor(platform: MarketingPlatform): SocialPublisher {
  // Provider-specific OAuth adapters are deliberately injected here later.
  // This keeps campaign creation/approval independent of Metricool or direct APIs.
  return new UnconfiguredPublisher(platform);
}
