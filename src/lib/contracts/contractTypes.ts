export type ContractCategory =
  | "terms_of_service"
  | "non_redistribution"
  | "licensing_restrictions"
  | "education_license"
  | "partner_agreement";

export type ContractTemplate = {
  id: string;
  category: ContractCategory;
  title: string;
  description: string;
  requiredForAccess: boolean;
  regions: string[];
  languages: string[];
  version: string;
  autoAttachToProducts: boolean;
};

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: "tos_global_v1",
    category: "terms_of_service",
    title: "Global Terms of Service",
    description:
      "Base agreement required for access to Edunancial services and digital infrastructure.",
    requiredForAccess: true,
    regions: ["global"],
    languages: ["en", "es", "fr"],
    version: "1.0",
    autoAttachToProducts: true
  },
  {
    id: "non_redistribution_v1",
    category: "non_redistribution",
    title: "Non-Redistribution Agreement",
    description:
      "Users may not redistribute, repackage, resell, or publicly share Edunancial course material, frameworks, models, or systems.",
    requiredForAccess: true,
    regions: ["global"],
    languages: ["en", "es", "fr"],
    version: "1.0",
    autoAttachToProducts: true
  },
  {
    id: "licensing_framework_v1",
    category: "licensing_restrictions",
    title: "Platform Licensing Restrictions",
    description:
      "Defines limits on republishing or licensing Edunancial intellectual frameworks or models without written permission.",
    requiredForAccess: true,
    regions: ["global"],
    languages: ["en", "es", "fr"],
    version: "1.0",
    autoAttachToProducts: true
  },
  {
    id: "education_license_v1",
    category: "education_license",
    title: "Education Program License",
    description:
      "Allows individuals or institutions to use Edunancial educational programs under defined licensing terms.",
    requiredForAccess: false,
    regions: ["global"],
    languages: ["en", "es", "fr"],
    version: "1.0",
    autoAttachToProducts: true
  },
  {
    id: "partner_agreement_v1",
    category: "partner_agreement",
    title: "Partner Distribution Agreement",
    description:
      "Agreement used when partners distribute Edunancial education systems or operate affiliated learning programs.",
    requiredForAccess: false,
    regions: ["global"],
    languages: ["en", "es", "fr"],
    version: "1.0",
    autoAttachToProducts: false
  }
];
