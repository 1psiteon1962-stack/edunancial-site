// ======================================================
// AI COUNTRY KNOWLEDGE ABSTRACTION
// Data-driven country-specific business knowledge.
// Country knowledge is never embedded in prompts;
// it is loaded by the country-selection framework
// and injected into context at runtime.
// ======================================================

export interface BusinessEntityType {
  localName: string;
  englishEquivalent: string;
  description: string;
}

export interface CompanyRegistrationInfo {
  registrationBody: string;
  registrationBodyLocalName: string;
  taxIdentifierLabel: string;
  taxIdentifierLocalName: string;
  registrationProcess: string;
}

export interface TaxationInfo {
  primaryTaxType: string;
  primaryTaxLabel: string;
  taxAuthority: string;
  taxAuthorityLocalName: string;
  corporateTaxRate: string;
  vatGstRate: string;
  filingNote: string;
}

export interface AccountingInfo {
  standard: string;
  reportingCurrency: string;
  fiscalYearNote: string;
}

export interface ComplianceLicensingInfo {
  primaryRegulator: string;
  primaryRegulatorLocalName: string;
  keyLicensingBodies: string[];
  generalNote: string;
}

export interface LegalTerminologyNote {
  term: string;
  localEquivalent: string;
  explanation: string;
}

export interface CountryKnowledge {
  isoCode: string;
  country: string;
  primaryLanguage: string;
  businessEntities: BusinessEntityType[];
  companyRegistration: CompanyRegistrationInfo;
  taxation: TaxationInfo;
  accounting: AccountingInfo;
  complianceLicensing: ComplianceLicensingInfo;
  legalTerminology: LegalTerminologyNote[];
}

const COUNTRY_KNOWLEDGE_MAP: Record<string, CountryKnowledge> = {
  US: {
    isoCode: "US",
    country: "United States",
    primaryLanguage: "en",
    businessEntities: [
      { localName: "Corporation", englishEquivalent: "Corporation", description: "A legal entity distinct from its owners, governed by a board of directors." },
      { localName: "LLC", englishEquivalent: "Limited Liability Company", description: "Flexible entity combining LLC-style liability protection with pass-through taxation." },
      { localName: "S-Corp", englishEquivalent: "S Corporation", description: "A corporation that elects pass-through taxation under Subchapter S of the Internal Revenue Code." },
      { localName: "Sole Proprietorship", englishEquivalent: "Sole Proprietorship", description: "Unregistered business owned and operated by one individual." },
      { localName: "Partnership", englishEquivalent: "Partnership", description: "Business owned by two or more people; can be general or limited." },
    ],
    companyRegistration: {
      registrationBody: "State Secretary of State office",
      registrationBodyLocalName: "Secretary of State",
      taxIdentifierLabel: "Employer Identification Number (EIN)",
      taxIdentifierLocalName: "EIN",
      registrationProcess: "File Articles of Incorporation or Organization with the relevant state agency and obtain an EIN from the IRS.",
    },
    taxation: {
      primaryTaxType: "Federal Income Tax + State Tax + Sales Tax",
      primaryTaxLabel: "Federal Income Tax",
      taxAuthority: "Internal Revenue Service",
      taxAuthorityLocalName: "IRS",
      corporateTaxRate: "21% federal corporate income tax",
      vatGstRate: "No federal VAT; state sales tax varies (0–10%)",
      filingNote: "Corporate returns filed on Form 1120; partnerships on Form 1065.",
    },
    accounting: {
      standard: "US GAAP",
      reportingCurrency: "USD",
      fiscalYearNote: "Fiscal year can differ from calendar year; must be consistent.",
    },
    complianceLicensing: {
      primaryRegulator: "SEC, FTC, and state agencies depending on industry",
      primaryRegulatorLocalName: "SEC / FTC",
      keyLicensingBodies: ["SEC", "FINRA", "State Departments of Revenue", "Occupational Licensing Boards"],
      generalNote: "Licensing requirements vary significantly by state and industry.",
    },
    legalTerminology: [
      { term: "Operating Agreement", localEquivalent: "Operating Agreement", explanation: "Governing document for an LLC outlining ownership and operating procedures." },
      { term: "Articles of Incorporation", localEquivalent: "Articles of Incorporation", explanation: "Document filed with the state to create a corporation." },
      { term: "Bylaws", localEquivalent: "Corporate Bylaws", explanation: "Internal rules governing how a corporation is run." },
    ],
  },

  UG: {
    isoCode: "UG",
    country: "Uganda",
    primaryLanguage: "en",
    businessEntities: [
      { localName: "Private Limited Company", englishEquivalent: "Private Limited Company", description: "Most common business structure; shareholders' liability is limited to their shares." },
      { localName: "Public Limited Company", englishEquivalent: "Public Limited Company", description: "Can offer shares to the public; listed on the Uganda Securities Exchange." },
      { localName: "Sole Proprietorship", englishEquivalent: "Sole Proprietorship", description: "Business owned by one individual; no legal distinction between owner and business." },
      { localName: "Partnership", englishEquivalent: "Partnership", description: "Business owned by two or more people under a partnership deed." },
      { localName: "Cooperative Society", englishEquivalent: "Cooperative", description: "Member-owned organization common in agriculture and savings groups." },
    ],
    companyRegistration: {
      registrationBody: "Uganda Registration Services Bureau",
      registrationBodyLocalName: "URSB",
      taxIdentifierLabel: "Tax Identification Number",
      taxIdentifierLocalName: "TIN",
      registrationProcess: "Register with the URSB online or in person. Obtain a TIN from the Uganda Revenue Authority (URA). Register for VAT if turnover exceeds the threshold.",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax + VAT + Withholding Tax",
      primaryTaxLabel: "Corporate Income Tax",
      taxAuthority: "Uganda Revenue Authority",
      taxAuthorityLocalName: "URA",
      corporateTaxRate: "30% standard corporate income tax",
      vatGstRate: "18% VAT",
      filingNote: "Annual income tax return filed with URA; VAT returns filed monthly.",
    },
    accounting: {
      standard: "IFRS (International Financial Reporting Standards)",
      reportingCurrency: "UGX (Ugandan Shilling)",
      fiscalYearNote: "Standard fiscal year is July 1 to June 30 following the government financial year.",
    },
    complianceLicensing: {
      primaryRegulator: "Bank of Uganda (financial sector), Capital Markets Authority",
      primaryRegulatorLocalName: "Bank of Uganda / CMA Uganda",
      keyLicensingBodies: ["Bank of Uganda", "Capital Markets Authority Uganda", "Insurance Regulatory Authority", "URSB"],
      generalNote: "Sector-specific licenses required; financial service providers regulated by Bank of Uganda.",
    },
    legalTerminology: [
      { term: "Memorandum of Association", localEquivalent: "Memorandum of Association", explanation: "Document defining the company's constitution and scope of operations under the Companies Act 2012." },
      { term: "Articles of Association", localEquivalent: "Articles of Association", explanation: "Internal rules governing the company's management." },
      { term: "Certificate of Incorporation", localEquivalent: "Certificate of Incorporation", explanation: "Official document from URSB confirming the company is legally registered." },
    ],
  },

  NG: {
    isoCode: "NG",
    country: "Nigeria",
    primaryLanguage: "en",
    businessEntities: [
      { localName: "Private Limited Company", englishEquivalent: "Private Limited Company (Ltd)", description: "Most common structure; limited liability for shareholders." },
      { localName: "Public Limited Company", englishEquivalent: "Public Limited Company (Plc)", description: "Can offer shares to the public; regulated by SEC Nigeria." },
      { localName: "Business Name", englishEquivalent: "Sole Proprietorship / Partnership", description: "Registered business name used by sole traders and small partnerships." },
      { localName: "Incorporated Trustee", englishEquivalent: "Non-Profit Organization", description: "Used for charities, religious bodies, and associations." },
      { localName: "Limited Liability Partnership", englishEquivalent: "LLP", description: "Hybrid entity combining partnership flexibility with limited liability." },
    ],
    companyRegistration: {
      registrationBody: "Corporate Affairs Commission",
      registrationBodyLocalName: "CAC",
      taxIdentifierLabel: "Tax Identification Number",
      taxIdentifierLocalName: "TIN",
      registrationProcess: "Register with the CAC through the CAC portal. Obtain a TIN from the Federal Inland Revenue Service (FIRS). Register for VAT if applicable.",
    },
    taxation: {
      primaryTaxType: "Company Income Tax + VAT + Withholding Tax + Education Tax",
      primaryTaxLabel: "Company Income Tax",
      taxAuthority: "Federal Inland Revenue Service",
      taxAuthorityLocalName: "FIRS",
      corporateTaxRate: "30% standard company income tax; 20% for medium companies; 0% for small companies (turnover < ₦25M)",
      vatGstRate: "7.5% VAT",
      filingNote: "Company income tax returns filed with FIRS; VAT returns filed monthly.",
    },
    accounting: {
      standard: "IFRS (mandatory for public companies and significant entities)",
      reportingCurrency: "NGN (Nigerian Naira)",
      fiscalYearNote: "Can choose any 12-month period; must remain consistent.",
    },
    complianceLicensing: {
      primaryRegulator: "Securities and Exchange Commission, Central Bank of Nigeria",
      primaryRegulatorLocalName: "SEC Nigeria / CBN",
      keyLicensingBodies: ["SEC Nigeria", "Central Bank of Nigeria (CBN)", "National Insurance Commission (NAICOM)", "CAC"],
      generalNote: "Financial institutions require CBN licensing; investment firms require SEC Nigeria registration.",
    },
    legalTerminology: [
      { term: "Memorandum of Association", localEquivalent: "Memorandum of Association", explanation: "Founding document setting out the company's objectives, filed with the CAC." },
      { term: "Articles of Association", localEquivalent: "Articles of Association", explanation: "Rules governing the internal management of the company." },
      { term: "Certificate of Incorporation", localEquivalent: "Certificate of Incorporation", explanation: "Official document from the CAC confirming legal registration." },
    ],
  },

  KE: {
    isoCode: "KE",
    country: "Kenya",
    primaryLanguage: "en",
    businessEntities: [
      { localName: "Private Limited Company", englishEquivalent: "Private Limited Company (Ltd)", description: "Most common business structure; shareholders' liability limited to unpaid shares." },
      { localName: "Public Limited Company", englishEquivalent: "Public Limited Company (Plc)", description: "Can offer shares to the public on the Nairobi Securities Exchange." },
      { localName: "Sole Proprietorship", englishEquivalent: "Sole Proprietorship", description: "Single-owner business registered with the Registrar of Business Names." },
      { localName: "Partnership", englishEquivalent: "Partnership", description: "Two or more persons operating under a partnership deed." },
    ],
    companyRegistration: {
      registrationBody: "Business Registration Service",
      registrationBodyLocalName: "BRS / eCitizen",
      taxIdentifierLabel: "Personal Identification Number",
      taxIdentifierLocalName: "PIN",
      registrationProcess: "Register via eCitizen portal (BRS). Obtain a KRA PIN from the Kenya Revenue Authority. Register for VAT if turnover exceeds the threshold.",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax + VAT + Withholding Tax",
      primaryTaxLabel: "Corporate Income Tax",
      taxAuthority: "Kenya Revenue Authority",
      taxAuthorityLocalName: "KRA",
      corporateTaxRate: "30% resident companies; 37.5% non-resident",
      vatGstRate: "16% VAT",
      filingNote: "Returns filed via iTax portal; VAT filed monthly.",
    },
    accounting: {
      standard: "IFRS",
      reportingCurrency: "KES (Kenyan Shilling)",
      fiscalYearNote: "Standard fiscal year runs January to December; government year is July to June.",
    },
    complianceLicensing: {
      primaryRegulator: "Capital Markets Authority, Central Bank of Kenya",
      primaryRegulatorLocalName: "CMA Kenya / CBK",
      keyLicensingBodies: ["Capital Markets Authority", "Central Bank of Kenya (CBK)", "Insurance Regulatory Authority (IRA)", "BRS"],
      generalNote: "Financial service providers regulated by CBK; investment managers by CMA.",
    },
    legalTerminology: [
      { term: "Memorandum and Articles of Association", localEquivalent: "Memorandum and Articles", explanation: "Combined founding and governance document under Kenya's Companies Act 2015." },
      { term: "Certificate of Incorporation", localEquivalent: "Certificate of Incorporation", explanation: "Official BRS document confirming company registration." },
    ],
  },

  JP: {
    isoCode: "JP",
    country: "Japan",
    primaryLanguage: "ja",
    businessEntities: [
      { localName: "株式会社", englishEquivalent: "Kabushiki Kaisha (KK) — Joint-Stock Company", description: "Most common business form; limited liability for shareholders." },
      { localName: "合同会社", englishEquivalent: "Godo Kaisha (GK) — Limited Liability Company", description: "Simpler and lower-cost than KK; suitable for small businesses and startups." },
      { localName: "合名会社", englishEquivalent: "Gomei Kaisha — General Partnership Company", description: "All partners bear unlimited joint liability." },
      { localName: "合資会社", englishEquivalent: "Goshi Kaisha — Limited Partnership Company", description: "Mix of general and limited liability partners." },
    ],
    companyRegistration: {
      registrationBody: "Legal Affairs Bureau",
      registrationBodyLocalName: "法務局 (Hōmukyoku)",
      taxIdentifierLabel: "Corporate Number",
      taxIdentifierLocalName: "法人番号 (Hōjin Bangō)",
      registrationProcess: "File registration documents (Articles of Incorporation / teikan) with the Legal Affairs Bureau. A corporate number is issued automatically.",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax + Consumption Tax + Local Tax",
      primaryTaxLabel: "Corporation Tax (法人税)",
      taxAuthority: "National Tax Agency",
      taxAuthorityLocalName: "国税庁 (Kokuzei-chō)",
      corporateTaxRate: "23.2% national corporation tax (effective combined rate ~30%)",
      vatGstRate: "10% Consumption Tax (消費税); 8% on food",
      filingNote: "Annual tax return (確定申告) filed within 2 months of fiscal year end.",
    },
    accounting: {
      standard: "Japan GAAP (J-GAAP) or IFRS for listed companies",
      reportingCurrency: "JPY (Japanese Yen)",
      fiscalYearNote: "Most companies use April 1 – March 31 fiscal year.",
    },
    complianceLicensing: {
      primaryRegulator: "Financial Services Agency",
      primaryRegulatorLocalName: "金融庁 (Kinyū-chō)",
      keyLicensingBodies: ["Financial Services Agency (FSA)", "Tokyo Stock Exchange (TSE)", "Bank of Japan", "Consumer Affairs Agency"],
      generalNote: "Financial institutions must obtain FSA registration; securities dealers require FSA registration.",
    },
    legalTerminology: [
      { term: "定款 (Teikan)", localEquivalent: "Articles of Incorporation", explanation: "Foundational corporate document defining the company's purpose and rules." },
      { term: "取締役 (Torishimariyaku)", localEquivalent: "Director / Board Member", explanation: "Corporate officer responsible for company management." },
      { term: "代表取締役 (Daihyō Torishimariyaku)", localEquivalent: "Representative Director / CEO", explanation: "Director authorized to represent and bind the company." },
    ],
  },

  KR: {
    isoCode: "KR",
    country: "South Korea",
    primaryLanguage: "ko",
    businessEntities: [
      { localName: "주식회사 (Jusik Hoesa)", englishEquivalent: "Corporation (Stock Company)", description: "Most common structure for larger businesses; shareholders have limited liability." },
      { localName: "유한회사 (Yuhan Hoesa)", englishEquivalent: "Limited Liability Company", description: "Simpler structure suitable for small to medium businesses." },
      { localName: "개인사업자 (Gaein Saeopja)", englishEquivalent: "Sole Proprietorship", description: "Individual operating a business without separate legal entity status." },
    ],
    companyRegistration: {
      registrationBody: "Supreme Court Registry Office / Korea Business Registry",
      registrationBodyLocalName: "법원 등기소",
      taxIdentifierLabel: "Business Registration Number",
      taxIdentifierLocalName: "사업자등록번호",
      registrationProcess: "Register the company with the Court Registry, then register for tax with the National Tax Service (NTS).",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax + VAT + Local Income Tax",
      primaryTaxLabel: "Corporate Income Tax (법인세)",
      taxAuthority: "National Tax Service",
      taxAuthorityLocalName: "국세청 (Guksecheong)",
      corporateTaxRate: "9%–24% progressive corporate income tax",
      vatGstRate: "10% VAT",
      filingNote: "Corporate tax return filed within 3 months of fiscal year end.",
    },
    accounting: {
      standard: "K-IFRS (Korean IFRS, mandatory for listed companies) or Korean GAAP",
      reportingCurrency: "KRW (Korean Won)",
      fiscalYearNote: "Usually January 1 – December 31.",
    },
    complianceLicensing: {
      primaryRegulator: "Financial Services Commission / Financial Supervisory Service",
      primaryRegulatorLocalName: "금융위원회 / 금융감독원",
      keyLicensingBodies: ["Financial Services Commission (FSC)", "Financial Supervisory Service (FSS)", "Korea Exchange (KRX)"],
      generalNote: "Financial institutions require FSC authorization; capital market participants require registration.",
    },
    legalTerminology: [
      { term: "정관 (Jeonggwan)", localEquivalent: "Articles of Incorporation", explanation: "Founding corporate document." },
      { term: "이사 (Isa)", localEquivalent: "Director", explanation: "Corporate officer responsible for management decisions." },
    ],
  },
};

/**
 * Returns the country knowledge model for a given ISO country code.
 * Returns null if the country is not yet in the knowledge base.
 */
export function getCountryKnowledge(isoCode: string): CountryKnowledge | null {
  return COUNTRY_KNOWLEDGE_MAP[isoCode.toUpperCase()] ?? null;
}

/**
 * Returns all country ISO codes for which knowledge is available.
 */
export function getSupportedKnowledgeCountries(): string[] {
  return Object.keys(COUNTRY_KNOWLEDGE_MAP);
}

/**
 * Returns a summary of available knowledge areas for a country
 * without exposing the full model (useful for capability checks).
 */
export function getCountryKnowledgeSummary(isoCode: string): {
  hasKnowledge: boolean;
  country: string | null;
  entityCount: number;
  hasAccountingInfo: boolean;
  hasTaxationInfo: boolean;
} {
  const knowledge = getCountryKnowledge(isoCode);

  if (!knowledge) {
    return {
      hasKnowledge: false,
      country: null,
      entityCount: 0,
      hasAccountingInfo: false,
      hasTaxationInfo: false,
    };
  }

  return {
    hasKnowledge: true,
    country: knowledge.country,
    entityCount: knowledge.businessEntities.length,
    hasAccountingInfo: Boolean(knowledge.accounting),
    hasTaxationInfo: Boolean(knowledge.taxation),
  };
}
