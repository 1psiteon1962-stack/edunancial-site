export enum SuspensionType{
PAYMENT="PAYMENT",
POLICY="POLICY",
LICENSE="LICENSE",
INSURANCE="INSURANCE",
MANUAL="MANUAL"
}

export interface ProviderSuspension{
providerId:string;
type:SuspensionType;
active:boolean;
publicListing:boolean;
aiEligible:boolean;
leadRouting:boolean;
refundEligible:boolean;
notes:string;
createdAt:string;
}
