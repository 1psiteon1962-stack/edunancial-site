export type AffiliateEvent = {
  affiliateId: string;
  offerId: string;
  amount: number;
};

const AFFILIATE_LOG: AffiliateEvent[] = [];

export function recordAffiliateSale(event: AffiliateEvent) {
  AFFILIATE_LOG.push(event);
}

export function getAffiliateEarnings(id: string) {
  return AFFILIATE_LOG.filter(a => a.affiliateId === id)
    .reduce((sum, a) => sum + a.amount * 0.2, 0); // 20% commission
}
