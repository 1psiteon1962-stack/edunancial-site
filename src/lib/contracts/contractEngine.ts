import { CONTRACT_TEMPLATES } from "@/lib/contracts/contractTypes";

export type ContractAcceptanceRecord = {
  userId: string;
  contractId: string;
  acceptedAt: string;
  version: string;
};

export function getRequiredContracts(region: string) {
  return CONTRACT_TEMPLATES.filter((contract) => {
    if (contract.regions.includes("global")) return true;
    return contract.regions.includes(region);
  }).filter((contract) => contract.requiredForAccess);
}

export function getContractsForProduct(productId: string) {
  return CONTRACT_TEMPLATES.filter(
    (contract) => contract.autoAttachToProducts === true
  );
}

export function verifyUserContracts(
  userContracts: ContractAcceptanceRecord[],
  region: string
) {
  const required = getRequiredContracts(region);

  const acceptedIds = new Set(userContracts.map((c) => c.contractId));

  const missing = required.filter((contract) => !acceptedIds.has(contract.id));

  return {
    compliant: missing.length === 0,
    missingContracts: missing
  };
}
