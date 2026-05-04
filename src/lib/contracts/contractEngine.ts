import { CONTRACT_TEMPLATES, ContractTemplateKey } from "@/lib/contracts/contractTypes";

export type ContractAcceptanceRecord = {
  userId: string;
  contractKey: ContractTemplateKey;
  acceptedAt: string;
  version: string;
};

export function getContractTemplate(contractKey: ContractTemplateKey) {
  return CONTRACT_TEMPLATES[contractKey];
}

export function createContractAcceptanceRecord(params: {
  userId: string;
  contractKey: ContractTemplateKey;
}): ContractAcceptanceRecord {
  const template = getContractTemplate(params.contractKey);

  return {
    userId: params.userId,
    contractKey: params.contractKey,
    acceptedAt: new Date().toISOString(),
    version: template.version,
  };
}
