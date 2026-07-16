# Regional Pricing and Payments

## Pricing framework
- Versioned records in `PRICING_TABLE`
- Effective date windows
- Status-gated activation (`planned`, `active`, etc.)
- Regional + optional country scoping

Server-side selection:
- `selectPricingRecord({ region, membershipTier, country, asOf })`

Only active/effective records resolve. Planned prices do not.

## Payment provider framework
- Capability registry in `PAYMENT_PROVIDER_CAPABILITIES`
- Region/country capability gating
- Server-side provider selection only

Server-side selector:
- `selectPaymentProviderServerSide({ region, country, preferredProvider })`

Rules:
- no unconfigured provider activation
- no reliance on client-supplied provider trust
- inactive region/provider returns null with reason
