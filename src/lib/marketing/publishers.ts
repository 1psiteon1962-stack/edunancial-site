import type { MarketingPlatform, PublishRequest, PublishResult, SocialPublisher } from './types';

export class UnconfiguredPublisher implements SocialPublisher {
  constructor(public readonly platform: MarketingPlatform) {}

  async publish(_request: PublishRequest): Promise<PublishResult> {
    throw new Error(`Marketing publisher for ${this.platform} is not configured. Connect the authorized provider before publishing.`);
  }
}

class LinkedInPublisher implements SocialPublisher {
  readonly platform='linkedin';
  async publish(request:PublishRequest):Promise<PublishResult>{
    const token=process.env.LINKEDIN_ACCESS_TOKEN;
    const author=process.env.LINKEDIN_AUTHOR_URN;
    if(!token||!author) throw new Error('LinkedIn publishing is not configured: LINKEDIN_ACCESS_TOKEN and LINKEDIN_AUTHOR_URN are required.');
    if(request.mediaRefs.length) throw new Error('LinkedIn media publishing is not enabled yet; refusing to drop media silently.');
    const res=await fetch('https://api.linkedin.com/v2/ugcPosts',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json','X-Restli-Protocol-Version':'2.0.0'},body:JSON.stringify({author,lifecycleState:'PUBLISHED',specificContent:{'com.linkedin.ugc.ShareContent':{shareCommentary:{text:request.copy},shareMediaCategory:'NONE'}},visibility:{'com.linkedin.ugc.MemberNetworkVisibility':'PUBLIC'}})});
    if(!res.ok) throw new Error(`LinkedIn publish failed (${res.status}): ${(await res.text()).slice(0,500)}`);
    const id=res.headers.get('x-restli-id')||res.headers.get('x-linkedin-id');
    if(!id) throw new Error('LinkedIn accepted the post but returned no publication id.');
    return {providerPublicationId:id,publishedAt:new Date().toISOString()};
  }
}

export function publisherFor(platform: MarketingPlatform): SocialPublisher {
  if(platform==='linkedin') return new LinkedInPublisher();
  return new UnconfiguredPublisher(platform);
}
