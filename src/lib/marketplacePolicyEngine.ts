export enum ProviderStatus{
ACTIVE="ACTIVE",
PAYMENT_PENDING="PAYMENT_PENDING",
SUSPENDED="SUSPENDED",
TERMINATED="TERMINATED"
}

export enum SuspensionReason{
PAYMENT_FAILURE="PAYMENT_FAILURE",
LICENSE_EXPIRED="LICENSE_EXPIRED",
INSURANCE_EXPIRED="INSURANCE_EXPIRED",
POLICY_VIOLATION="POLICY_VIOLATION",
MANUAL_REVIEW="MANUAL_REVIEW"
}

export interface MarketplacePolicyDecision{
status:ProviderStatus;
reason?:SuspensionReason;
publicListingVisible:boolean;
eligibleForAIReferral:boolean;
acceptingNewLeads:boolean;
}
