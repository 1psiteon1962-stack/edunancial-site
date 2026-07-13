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

  // ── Philippines ────────────────────────────────────────────────────────────
  PH: {
    isoCode: "PH",
    country: "Philippines",
    primaryLanguage: "fil",
    businessEntities: [
      { localName: "Corporation", englishEquivalent: "Corporation", description: "A legal entity with limited liability, governed by the Revised Corporation Code." },
      { localName: "One Person Corporation (OPC)", englishEquivalent: "One Person Corporation", description: "A single stockholder corporation introduced by the Revised Corporation Code of 2018." },
      { localName: "Sole Proprietorship", englishEquivalent: "Sole Proprietorship", description: "Owned and operated by one individual; registered with the DTI." },
      { localName: "Partnership", englishEquivalent: "Partnership", description: "Two or more persons binding themselves to contribute money or property to a common fund." },
    ],
    companyRegistration: {
      registrationBody: "Securities and Exchange Commission (SEC)",
      registrationBodyLocalName: "SEC Philippines",
      taxIdentifierLabel: "Taxpayer Identification Number",
      taxIdentifierLocalName: "TIN",
      registrationProcess: "Register with the SEC (corporations) or DTI (sole proprietorships), obtain a TIN from the BIR, and register with local government.",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax + VAT",
      primaryTaxLabel: "Corporate Income Tax",
      taxAuthority: "Bureau of Internal Revenue",
      taxAuthorityLocalName: "BIR",
      corporateTaxRate: "25% (large corporations); 20% (small corporations with net taxable income ≤ PHP 5M and assets ≤ PHP 100M)",
      vatGstRate: "12% VAT",
      filingNote: "Annual income tax return filed using BIR Form 1702; quarterly VAT returns on BIR Form 2550Q.",
    },
    accounting: {
      standard: "Philippine Financial Reporting Standards (PFRS), aligned with IFRS",
      reportingCurrency: "PHP",
      fiscalYearNote: "Calendar year is standard; different fiscal years require BIR approval.",
    },
    complianceLicensing: {
      primaryRegulator: "Securities and Exchange Commission (SEC) and Bangko Sentral ng Pilipinas (BSP)",
      primaryRegulatorLocalName: "SEC / BSP",
      keyLicensingBodies: ["SEC Philippines", "BSP", "BIR", "Insurance Commission"],
      generalNote: "Financial intermediaries are regulated by the BSP; securities dealers require SEC registration.",
    },
    legalTerminology: [
      { term: "Bangko Sentral ng Pilipinas", localEquivalent: "Central Bank of the Philippines", explanation: "The central monetary authority." },
      { term: "Bureau of Internal Revenue", localEquivalent: "BIR", explanation: "The tax collection agency." },
    ],
  },

  // ── Vietnam ────────────────────────────────────────────────────────────────
  VN: {
    isoCode: "VN",
    country: "Vietnam",
    primaryLanguage: "vi",
    businessEntities: [
      { localName: "Công ty TNHH (LLC)", englishEquivalent: "Limited Liability Company", description: "One or multi-member LLC; common for small and medium enterprises." },
      { localName: "Công ty Cổ phần (JSC)", englishEquivalent: "Joint-Stock Company", description: "Can be listed; requires minimum 3 shareholders." },
      { localName: "Doanh nghiệp tư nhân", englishEquivalent: "Private Enterprise", description: "Owned by a single individual with unlimited liability." },
    ],
    companyRegistration: {
      registrationBody: "Department of Planning and Investment (DPI) / National Business Registration Portal",
      registrationBodyLocalName: "Sở Kế hoạch và Đầu tư",
      taxIdentifierLabel: "Tax Identification Number",
      taxIdentifierLocalName: "Mã số thuế",
      registrationProcess: "Register via the National Business Registration Portal; tax code is automatically issued upon business registration.",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax (CIT) + VAT",
      primaryTaxLabel: "Corporate Income Tax",
      taxAuthority: "General Department of Taxation",
      taxAuthorityLocalName: "Tổng cục Thuế",
      corporateTaxRate: "20% standard CIT rate",
      vatGstRate: "10% VAT (5% for certain goods/services)",
      filingNote: "CIT finalized by the 90th day after fiscal year end; quarterly provisional payments required.",
    },
    accounting: {
      standard: "Vietnamese Accounting Standards (VAS)",
      reportingCurrency: "VND",
      fiscalYearNote: "Calendar year is standard; enterprises may apply to use a different fiscal year.",
    },
    complianceLicensing: {
      primaryRegulator: "State Bank of Vietnam (SBV) and State Securities Commission (SSC)",
      primaryRegulatorLocalName: "NHNN / UBCKNN",
      keyLicensingBodies: ["State Bank of Vietnam", "State Securities Commission", "Ministry of Finance"],
      generalNote: "Foreign-invested enterprises may require additional investment registration certificates.",
    },
    legalTerminology: [
      { term: "Giấy chứng nhận đăng ký doanh nghiệp", localEquivalent: "Business Registration Certificate", explanation: "The foundational document establishing a legal entity." },
    ],
  },

  // ── Thailand ───────────────────────────────────────────────────────────────
  TH: {
    isoCode: "TH",
    country: "Thailand",
    primaryLanguage: "th",
    businessEntities: [
      { localName: "บริษัทจำกัด (Private Company Limited)", englishEquivalent: "Private Limited Company", description: "Most common business form; requires minimum 3 shareholders and 3 directors." },
      { localName: "บริษัทมหาชน (Public Company Limited)", englishEquivalent: "Public Company Limited", description: "Can offer shares to the public; regulated by SEC Thailand." },
      { localName: "ห้างหุ้นส่วนจำกัด (Limited Partnership)", englishEquivalent: "Limited Partnership", description: "Has general and limited partners; limited partners' liability capped at their contribution." },
    ],
    companyRegistration: {
      registrationBody: "Department of Business Development (DBD)",
      registrationBodyLocalName: "กรมพัฒนาธุรกิจการค้า (DBD)",
      taxIdentifierLabel: "Tax Identification Number",
      taxIdentifierLocalName: "เลขประจำตัวผู้เสียภาษี",
      registrationProcess: "Register with the DBD; obtain a 13-digit tax ID from the Revenue Department.",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax (CIT) + VAT",
      primaryTaxLabel: "Corporate Income Tax",
      taxAuthority: "Revenue Department",
      taxAuthorityLocalName: "กรมสรรพากร",
      corporateTaxRate: "20% standard CIT rate; SME preferential rates apply",
      vatGstRate: "7% VAT (reduced from 10%)",
      filingNote: "Annual CIT return due within 150 days of fiscal year end; mid-year CIT return required.",
    },
    accounting: {
      standard: "Thai Financial Reporting Standards (TFRS), aligned with IFRS",
      reportingCurrency: "THB",
      fiscalYearNote: "Fiscal year is 12 months; can differ from calendar year.",
    },
    complianceLicensing: {
      primaryRegulator: "Bank of Thailand (BOT) and Securities and Exchange Commission (SEC Thailand)",
      primaryRegulatorLocalName: "ธนาคารแห่งประเทศไทย / ก.ล.ต.",
      keyLicensingBodies: ["Bank of Thailand", "SEC Thailand", "Revenue Department", "Office of Insurance Commission"],
      generalNote: "Financial businesses require BOT or SEC licenses; foreign business ownership subject to the Foreign Business Act.",
    },
    legalTerminology: [
      { term: "หนังสือบริคณห์สนธิ (Memorandum of Association)", localEquivalent: "Memorandum of Association", explanation: "Charter document for a limited company." },
    ],
  },

  // ── Singapore ──────────────────────────────────────────────────────────────
  SG: {
    isoCode: "SG",
    country: "Singapore",
    primaryLanguage: "en",
    businessEntities: [
      { localName: "Private Limited Company (Pte. Ltd.)", englishEquivalent: "Private Limited Company", description: "Most popular structure; limited liability with up to 50 shareholders." },
      { localName: "Sole Proprietorship", englishEquivalent: "Sole Proprietorship", description: "Owned by one person; no separation between owner and business." },
      { localName: "Limited Liability Partnership (LLP)", englishEquivalent: "Limited Liability Partnership", description: "Partners have limited liability; flexible internal management." },
    ],
    companyRegistration: {
      registrationBody: "Accounting and Corporate Regulatory Authority (ACRA)",
      registrationBodyLocalName: "ACRA",
      taxIdentifierLabel: "Unique Entity Number",
      taxIdentifierLocalName: "UEN",
      registrationProcess: "Incorporate via Bizfile+ portal on ACRA; a UEN is automatically assigned upon registration.",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax + GST",
      primaryTaxLabel: "Corporate Income Tax",
      taxAuthority: "Inland Revenue Authority of Singapore",
      taxAuthorityLocalName: "IRAS",
      corporateTaxRate: "17% flat corporate tax rate",
      vatGstRate: "9% GST",
      filingNote: "Annual income tax return (Form C or Form C-S) due by 30 November; estimated chargeable income (ECI) filing required within 3 months of financial year end.",
    },
    accounting: {
      standard: "Singapore Financial Reporting Standards (SFRS), closely aligned with IFRS",
      reportingCurrency: "SGD",
      fiscalYearNote: "Financial year can be set by the company; many use December 31 as year end.",
    },
    complianceLicensing: {
      primaryRegulator: "Monetary Authority of Singapore (MAS)",
      primaryRegulatorLocalName: "MAS",
      keyLicensingBodies: ["MAS", "ACRA", "IRAS", "Enterprise Singapore"],
      generalNote: "Financial services require MAS licensing; Singapore is a major international financial centre with robust regulatory framework.",
    },
    legalTerminology: [
      { term: "Memorandum and Articles of Association", localEquivalent: "Constitution", explanation: "Governing document of a Singapore company (called 'Constitution' since 2015)." },
      { term: "Director", localEquivalent: "Director", explanation: "Must be a Singapore resident for at least one director of a local company." },
    ],
  },

  // ── India ──────────────────────────────────────────────────────────────────
  IN: {
    isoCode: "IN",
    country: "India",
    primaryLanguage: "hi",
    businessEntities: [
      { localName: "Private Limited Company (Pvt. Ltd.)", englishEquivalent: "Private Limited Company", description: "Most common corporate form; restricted share transfer; limited liability." },
      { localName: "One Person Company (OPC)", englishEquivalent: "One Person Company", description: "Single-shareholder company introduced under Companies Act 2013." },
      { localName: "Limited Liability Partnership (LLP)", englishEquivalent: "Limited Liability Partnership", description: "Combines partnership flexibility with limited liability." },
      { localName: "Sole Proprietorship", englishEquivalent: "Sole Proprietorship", description: "Unregistered individual business; unlimited liability." },
    ],
    companyRegistration: {
      registrationBody: "Ministry of Corporate Affairs (MCA)",
      registrationBodyLocalName: "MCA / Registrar of Companies (ROC)",
      taxIdentifierLabel: "Permanent Account Number",
      taxIdentifierLocalName: "PAN",
      registrationProcess: "Incorporate via the MCA21 portal; obtain a Certificate of Incorporation, DIN for directors, DSC, PAN, and TAN.",
    },
    taxation: {
      primaryTaxType: "Corporate Tax + GST",
      primaryTaxLabel: "Corporate Tax",
      taxAuthority: "Income Tax Department",
      taxAuthorityLocalName: "IT Department / CBDT",
      corporateTaxRate: "22% domestic companies (25.17% with surcharge and cess); new manufacturing companies at 15%",
      vatGstRate: "GST with multiple slabs: 0%, 5%, 12%, 18%, 28%",
      filingNote: "Income tax return due September 30 for companies; advance tax payments quarterly.",
    },
    accounting: {
      standard: "Indian Accounting Standards (Ind AS), aligned with IFRS",
      reportingCurrency: "INR",
      fiscalYearNote: "Fiscal year runs April 1 to March 31.",
    },
    complianceLicensing: {
      primaryRegulator: "Reserve Bank of India (RBI) and Securities and Exchange Board of India (SEBI)",
      primaryRegulatorLocalName: "RBI / SEBI",
      keyLicensingBodies: ["RBI", "SEBI", "IRDAI (insurance)", "PFRDA (pensions)", "MCA"],
      generalNote: "Sector-specific licenses required; FEMA governs foreign exchange transactions.",
    },
    legalTerminology: [
      { term: "Memorandum of Association (MoA)", localEquivalent: "Memorandum of Association", explanation: "Defines the company's fundamental charter and scope of activities." },
      { term: "Articles of Association (AoA)", localEquivalent: "Articles of Association", explanation: "Internal rules and regulations governing company management." },
    ],
  },

  // ── Saudi Arabia ───────────────────────────────────────────────────────────
  SA: {
    isoCode: "SA",
    country: "Saudi Arabia",
    primaryLanguage: "ar",
    businessEntities: [
      { localName: "شركة ذات مسؤولية محدودة (LLC)", englishEquivalent: "Limited Liability Company", description: "Most common business structure; minimum 2 shareholders with limited liability." },
      { localName: "شركة مساهمة (Joint Stock Company)", englishEquivalent: "Joint Stock Company", description: "Can be publicly listed; minimum 5 shareholders." },
      { localName: "مؤسسة فردية (Sole Establishment)", englishEquivalent: "Sole Establishment", description: "Single-owner business; unlimited liability." },
    ],
    companyRegistration: {
      registrationBody: "Ministry of Commerce",
      registrationBodyLocalName: "وزارة التجارة",
      taxIdentifierLabel: "Tax Identification Number",
      taxIdentifierLocalName: "رقم التعريف الضريبي",
      registrationProcess: "Register via the Ministry of Commerce portal (Maroof); obtain commercial registration (CR) and tax registration with ZATCA.",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax + VAT + Zakat",
      primaryTaxLabel: "Corporate Income Tax / Zakat",
      taxAuthority: "Zakat, Tax and Customs Authority",
      taxAuthorityLocalName: "هيئة الزكاة والضريبة والجمارك (ZATCA)",
      corporateTaxRate: "20% CIT for foreign entities; Saudi/GCC nationals subject to Zakat at 2.5%",
      vatGstRate: "15% VAT",
      filingNote: "VAT returns due monthly or quarterly; Zakat/CIT returns due within 120 days of fiscal year end.",
    },
    accounting: {
      standard: "International Financial Reporting Standards (IFRS) as adopted in Saudi Arabia",
      reportingCurrency: "SAR",
      fiscalYearNote: "Typically aligned with Gregorian calendar year; Hijri calendar may be used in records.",
    },
    complianceLicensing: {
      primaryRegulator: "Saudi Central Bank (SAMA) and Capital Market Authority (CMA)",
      primaryRegulatorLocalName: "مؤسسة النقد العربي السعودي / هيئة السوق المالية",
      keyLicensingBodies: ["SAMA", "CMA", "ZATCA", "Ministry of Commerce"],
      generalNote: "Financial services and insurance require SAMA licensing; capital market activities require CMA authorization.",
    },
    legalTerminology: [
      { term: "السجل التجاري (Al-Sijil Al-Tijari)", localEquivalent: "Commercial Registration", explanation: "The fundamental business license issued by the Ministry of Commerce." },
    ],
  },

  // ── UAE ────────────────────────────────────────────────────────────────────
  AE: {
    isoCode: "AE",
    country: "United Arab Emirates",
    primaryLanguage: "ar",
    businessEntities: [
      { localName: "Limited Liability Company (LLC)", englishEquivalent: "Limited Liability Company", description: "Requires a local UAE national sponsor (51% ownership) for mainland operations, or 100% foreign ownership in free zones." },
      { localName: "Free Zone Company (FZC/FZCO)", englishEquivalent: "Free Zone Company", description: "100% foreign ownership; operates within designated free zones with trade restrictions outside the zone." },
      { localName: "Branch Office", englishEquivalent: "Branch Office", description: "Extension of a foreign company; requires a UAE national service agent for mainland operations." },
    ],
    companyRegistration: {
      registrationBody: "Department of Economy and Tourism (DET) or relevant Free Zone Authority",
      registrationBodyLocalName: "دائرة الاقتصاد والسياحة",
      taxIdentifierLabel: "Tax Registration Number",
      taxIdentifierLocalName: "رقم التسجيل الضريبي (TRN)",
      registrationProcess: "Obtain trade license from DET (mainland) or free zone authority; register for VAT and Corporate Tax with the Federal Tax Authority.",
    },
    taxation: {
      primaryTaxType: "Corporate Tax + VAT",
      primaryTaxLabel: "Corporate Tax",
      taxAuthority: "Federal Tax Authority",
      taxAuthorityLocalName: "الهيئة الاتحادية للضرائب (FTA)",
      corporateTaxRate: "9% corporate tax on taxable income above AED 375,000 (effective June 2023)",
      vatGstRate: "5% VAT",
      filingNote: "Corporate tax returns due within 9 months of fiscal year end; VAT returns typically quarterly.",
    },
    accounting: {
      standard: "International Financial Reporting Standards (IFRS)",
      reportingCurrency: "AED",
      fiscalYearNote: "Calendar year typically used; free zone companies may choose different fiscal year.",
    },
    complianceLicensing: {
      primaryRegulator: "Central Bank of UAE and Securities and Commodities Authority (SCA)",
      primaryRegulatorLocalName: "المصرف المركزي الإماراتي / هيئة الأوراق المالية والسلع",
      keyLicensingBodies: ["Central Bank UAE", "SCA", "FTA", "CBUAE", "DIFC Financial Services Authority"],
      generalNote: "DIFC and ADGM operate as independent international financial centres with common law frameworks.",
    },
    legalTerminology: [
      { term: "رخصة تجارية (Trade License)", localEquivalent: "Trade License", explanation: "The primary business operating license issued by DET or free zone authority." },
    ],
  },

  // ── Iraq ───────────────────────────────────────────────────────────────────
  IQ: {
    isoCode: "IQ",
    country: "Iraq",
    primaryLanguage: "ar",
    businessEntities: [
      { localName: "شركة ذات مسؤولية محدودة (LLC)", englishEquivalent: "Limited Liability Company", description: "Most common business structure; governed by Company Law No. 21 of 1997." },
      { localName: "شركة مساهمة (Joint Stock Company)", englishEquivalent: "Joint Stock Company", description: "Public or private shareholding company; can be listed on the Iraq Stock Exchange." },
    ],
    companyRegistration: {
      registrationBody: "Companies Registration Directorate",
      registrationBodyLocalName: "دائرة تسجيل الشركات",
      taxIdentifierLabel: "Tax Identification Number",
      taxIdentifierLocalName: "رقم الضريبة",
      registrationProcess: "Register with the Companies Registration Directorate under the Ministry of Trade; obtain tax registration with the General Commission for Taxes.",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax",
      primaryTaxLabel: "Corporate Income Tax",
      taxAuthority: "General Commission for Taxes",
      taxAuthorityLocalName: "الهيئة العامة للضرائب",
      corporateTaxRate: "15% corporate income tax (oil sector at 35%)",
      vatGstRate: "No national VAT currently in force; general sales provisions apply",
      filingNote: "Annual tax return required; tax year follows the calendar year.",
    },
    accounting: {
      standard: "Iraqi Accounting Standards; IFRS increasingly adopted by listed companies",
      reportingCurrency: "IQD",
      fiscalYearNote: "Calendar year (January 1 to December 31).",
    },
    complianceLicensing: {
      primaryRegulator: "Central Bank of Iraq (CBI) and Iraq Securities Commission (ISC)",
      primaryRegulatorLocalName: "البنك المركزي العراقي / هيئة الأوراق المالية",
      keyLicensingBodies: ["Central Bank of Iraq", "Iraq Securities Commission", "General Commission for Taxes"],
      generalNote: "Banking and financial services require CBI authorization; capital market participants require ISC registration.",
    },
    legalTerminology: [
      { term: "شهادة التسجيل التجاري", localEquivalent: "Commercial Registration Certificate", explanation: "The primary document establishing a legal entity in Iraq." },
    ],
  },

  // ── South Africa ───────────────────────────────────────────────────────────
  ZA: {
    isoCode: "ZA",
    country: "South Africa",
    primaryLanguage: "en",
    businessEntities: [
      { localName: "Private Company (Pty) Ltd", englishEquivalent: "Private Company", description: "Most common structure; limited liability; governed by the Companies Act 71 of 2008." },
      { localName: "Non-Profit Company (NPC)", englishEquivalent: "Non-Profit Company", description: "Incorporated for public benefit without profit distribution." },
      { localName: "Sole Proprietor", englishEquivalent: "Sole Proprietor", description: "Simplest form; not separately registered; unlimited liability." },
    ],
    companyRegistration: {
      registrationBody: "Companies and Intellectual Property Commission (CIPC)",
      registrationBodyLocalName: "CIPC",
      taxIdentifierLabel: "Income Tax Reference Number",
      taxIdentifierLocalName: "Tax Number",
      registrationProcess: "Register online via the CIPC BizPortal; obtain an income tax reference number from SARS.",
    },
    taxation: {
      primaryTaxType: "Corporate Income Tax + VAT",
      primaryTaxLabel: "Corporate Income Tax",
      taxAuthority: "South African Revenue Service",
      taxAuthorityLocalName: "SARS",
      corporateTaxRate: "27% corporate income tax",
      vatGstRate: "15% VAT",
      filingNote: "Annual income tax return (ITR14) due 12 months after financial year end; provisional tax twice a year.",
    },
    accounting: {
      standard: "International Financial Reporting Standards (IFRS) for large entities; IFRS for SMEs for smaller ones",
      reportingCurrency: "ZAR",
      fiscalYearNote: "Tax year ends February 28; company financial year end can vary.",
    },
    complianceLicensing: {
      primaryRegulator: "South African Reserve Bank (SARB) and Financial Sector Conduct Authority (FSCA)",
      primaryRegulatorLocalName: "SARB / FSCA",
      keyLicensingBodies: ["SARB", "FSCA", "SARS", "National Credit Regulator (NCR)", "JSE"],
      generalNote: "Financial services providers require FSCA authorization; banks require SARB prudential licensing.",
    },
    legalTerminology: [
      { term: "Memorandum of Incorporation (MOI)", localEquivalent: "Memorandum of Incorporation", explanation: "The founding document of a South African company under the Companies Act 2008." },
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
