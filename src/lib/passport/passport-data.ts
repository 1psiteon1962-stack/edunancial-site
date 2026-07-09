export interface PassportBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  earnedOn: string;
  category: "milestone" | "skill" | "leadership";
}

export interface PassportCertificate {
  id: string;
  title: string;
  issuer: string;
  issuedOn: string;
  validThrough: string;
  status: "Verified" | "Active";
  credentialId: string;
  skillAreas: string[];
}

export interface TranscriptEntry {
  category: string;
  score: number;
  proficiency: string;
  evidence: string;
  continuingEducationHours: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: "assessment" | "certificate" | "badge" | "education";
}

export interface ContinuingEducationRecord {
  cycle: string;
  completedHours: number;
  requiredHours: number;
  focus: string;
  nextDeadline: string;
}

export interface CompetencyHistoryEntry {
  period: string;
  overallScore: number;
  personalFinance: number;
  investing: number;
  realEstate: number;
  business: number;
  riskManagement: number;
}

export interface PublicProfile {
  slug: string;
  displayName: string;
  title: string;
  location: string;
  summary: string;
  privacyNotice: string;
  publicAchievements: string[];
}

export interface VerificationRecord {
  recordId: string;
  learnerName: string;
  title: string;
  issuedOn: string;
  status: "Verified" | "Active";
  evidence: string;
}

export const learnerProfile = {
  displayName: "Jordan Ellis",
  memberSince: "January 2025",
  passportId: "EDU-PASSPORT-2026-001",
  overallScore: 92,
  passportStatus: "Verified & Shareable",
  rank: "Expert",
  nextRank: "Master",
  pointsToNextRank: 3,
  completedCourses: 18,
  activeAssessments: 6,
  learningHours: 128,
  certificatesEarned: 6,
  badgeCount: 8,
  continuingEducationHours: 34,
};

export const competencyBreakdown = [
  {
    area: "Personal Finance",
    score: 95,
    focus: "Cash-flow planning and reserves",
  },
  {
    area: "Investing",
    score: 89,
    focus: "Portfolio diversification and risk-adjusted returns",
  },
  {
    area: "Real Estate",
    score: 90,
    focus: "Deal analysis and acquisition readiness",
  },
  {
    area: "Business",
    score: 94,
    focus: "Revenue systems and KPI decision-making",
  },
  {
    area: "Risk Management",
    score: 91,
    focus: "Insurance, compliance, and downside planning",
  },
];

export const achievementBadges: PassportBadge[] = [
  {
    id: "first-assessment",
    title: "First Assessment",
    icon: "🥇",
    description: "Completed the first full Financial Competency assessment.",
    earnedOn: "Jan 15, 2025",
    category: "milestone",
  },
  {
    id: "cash-flow-mastery",
    title: "Cash-Flow Mastery",
    icon: "💸",
    description: "Demonstrated 90%+ competency in cash-flow planning.",
    earnedOn: "Mar 3, 2025",
    category: "skill",
  },
  {
    id: "investor-ready",
    title: "Investor Ready",
    icon: "📈",
    description: "Completed the investing pathway and portfolio simulation.",
    earnedOn: "Jun 20, 2025",
    category: "skill",
  },
  {
    id: "real-estate-analyst",
    title: "Real Estate Analyst",
    icon: "🏘️",
    description: "Earned verified competency in underwriting and ROI analysis.",
    earnedOn: "Sep 1, 2025",
    category: "skill",
  },
  {
    id: "business-builder",
    title: "Business Builder",
    icon: "💼",
    description: "Completed the business fundamentals and KPI series.",
    earnedOn: "Nov 12, 2025",
    category: "skill",
  },
  {
    id: "mentor-circle",
    title: "Mentor Circle",
    icon: "🤝",
    description: "Participated in peer coaching and group accountability.",
    earnedOn: "Jan 7, 2026",
    category: "leadership",
  },
  {
    id: "continuing-education",
    title: "Continuing Education",
    icon: "📚",
    description: "Maintained required annual continuing education hours.",
    earnedOn: "Apr 15, 2026",
    category: "milestone",
  },
  {
    id: "passport-verified",
    title: "Passport Verified",
    icon: "✅",
    description: "Public profile and credentials are ready for employer review.",
    earnedOn: "Jun 1, 2026",
    category: "leadership",
  },
];

export const passportCertificates: PassportCertificate[] = [
  {
    id: "personal-finance",
    title: "Personal Financial Management",
    issuer: "Edunancial",
    issuedOn: "Feb 10, 2025",
    validThrough: "Feb 10, 2028",
    status: "Verified",
    credentialId: "EDU-CERT-PFM-2025-021",
    skillAreas: ["Budgeting", "Emergency planning", "Debt reduction"],
  },
  {
    id: "investing",
    title: "Investing Fundamentals",
    issuer: "Edunancial",
    issuedOn: "Jun 24, 2025",
    validThrough: "Jun 24, 2028",
    status: "Verified",
    credentialId: "EDU-CERT-INV-2025-114",
    skillAreas: ["Asset allocation", "Risk tolerance", "Long-term planning"],
  },
  {
    id: "real-estate",
    title: "Real Estate Foundations",
    issuer: "Edunancial",
    issuedOn: "Sep 14, 2025",
    validThrough: "Sep 14, 2028",
    status: "Verified",
    credentialId: "EDU-CERT-REA-2025-223",
    skillAreas: ["Deal analysis", "Financing", "Cash-on-cash return"],
  },
  {
    id: "business",
    title: "Business Fundamentals",
    issuer: "Edunancial",
    issuedOn: "Nov 20, 2025",
    validThrough: "Nov 20, 2028",
    status: "Verified",
    credentialId: "EDU-CERT-BUS-2025-309",
    skillAreas: ["Pricing", "KPIs", "Operating systems"],
  },
  {
    id: "risk-management",
    title: "Risk Management",
    issuer: "Edunancial",
    issuedOn: "Feb 8, 2026",
    validThrough: "Feb 8, 2029",
    status: "Verified",
    credentialId: "EDU-CERT-RSK-2026-058",
    skillAreas: ["Insurance", "Compliance", "Scenario planning"],
  },
  {
    id: "financial-competency",
    title: "Financial Competency Passport Certificate",
    issuer: "Edunancial",
    issuedOn: "Jun 1, 2026",
    validThrough: "Jun 1, 2029",
    status: "Active",
    credentialId: "EDU-CERT-FCP-2026-001",
    skillAreas: ["Integrated decision-making", "Wealth building", "Stewardship"],
  },
];

export const skillsTranscript: TranscriptEntry[] = [
  {
    category: "Budgeting & cash flow",
    score: 95,
    proficiency: "Advanced",
    evidence: "Completed three simulations and a capstone cash reserve plan.",
    continuingEducationHours: 7,
  },
  {
    category: "Investing strategy",
    score: 89,
    proficiency: "Proficient",
    evidence: "Portfolio allocation lab and long-range investing pathway.",
    continuingEducationHours: 6,
  },
  {
    category: "Real estate analysis",
    score: 90,
    proficiency: "Proficient",
    evidence: "Underwriting workbook and acquisition readiness assessment.",
    continuingEducationHours: 5,
  },
  {
    category: "Business leadership",
    score: 94,
    proficiency: "Advanced",
    evidence: "KPI dashboard coursework and revenue systems practicum.",
    continuingEducationHours: 9,
  },
  {
    category: "Risk management",
    score: 91,
    proficiency: "Proficient",
    evidence: "Insurance matrix, continuity plan, and compliance review.",
    continuingEducationHours: 7,
  },
];

export const progressTimeline: TimelineEvent[] = [
  {
    date: "Jan 2025",
    title: "Passport activated",
    description: "Initial baseline assessment created the lifelong competency record.",
    type: "assessment",
  },
  {
    date: "Feb 2025",
    title: "First certificate issued",
    description: "Personal Financial Management credential added to the passport.",
    type: "certificate",
  },
  {
    date: "Jun 2025",
    title: "Investment badge earned",
    description: "Portfolio simulation badge unlocked after pathway completion.",
    type: "badge",
  },
  {
    date: "Nov 2025",
    title: "Business competency jump",
    description: "Overall passport score increased from 84 to 89 after KPI coursework.",
    type: "education",
  },
  {
    date: "Apr 2026",
    title: "Continuing education completed",
    description: "Annual continuing education requirement fully satisfied ahead of schedule.",
    type: "education",
  },
  {
    date: "Jun 2026",
    title: "Shareable profile published",
    description: "Employer-ready public profile and verification tools became available.",
    type: "assessment",
  },
];

export const continuingEducation: ContinuingEducationRecord[] = [
  {
    cycle: "2026 cycle",
    completedHours: 34,
    requiredHours: 30,
    focus: "Advanced business systems, estate planning, and investing updates",
    nextDeadline: "Dec 31, 2026",
  },
  {
    cycle: "2027 preview",
    completedHours: 6,
    requiredHours: 30,
    focus: "Tax strategy and international opportunity readiness",
    nextDeadline: "Dec 31, 2027",
  },
];

export const competencyHistory: CompetencyHistoryEntry[] = [
  {
    period: "Q1 2025",
    overallScore: 78,
    personalFinance: 84,
    investing: 72,
    realEstate: 75,
    business: 79,
    riskManagement: 80,
  },
  {
    period: "Q3 2025",
    overallScore: 86,
    personalFinance: 91,
    investing: 83,
    realEstate: 84,
    business: 88,
    riskManagement: 86,
  },
  {
    period: "Q1 2026",
    overallScore: 90,
    personalFinance: 94,
    investing: 87,
    realEstate: 88,
    business: 92,
    riskManagement: 89,
  },
  {
    period: "Q2 2026",
    overallScore: 92,
    personalFinance: 95,
    investing: 89,
    realEstate: 90,
    business: 94,
    riskManagement: 91,
  },
];

export const publicProfile: PublicProfile = {
  slug: "jordan-ellis",
  displayName: "Jordan Ellis",
  title: "Financial Competency Passport Holder",
  location: "Atlanta, Georgia, USA",
  summary:
    "Jordan maintains a verified Edunancial passport demonstrating sustained competency across personal finance, investing, business, real estate, and risk management.",
  privacyNotice:
    "This public profile only shares learner-approved achievements, current passport standing, and verification links. Personal contact details and detailed assessment responses stay private.",
  publicAchievements: [
    "6 verified certificates",
    "92 overall competency score",
    "34 continuing education hours completed",
    "Expert passport rank with Master track progress",
  ],
};

export const privacyPrinciples = [
  "Public sharing is limited to learner-approved achievements and verification IDs.",
  "Detailed assessment answers, payment details, and contact information stay private.",
  "Verification pages expose status and evidence only, not raw transcripts or sensitive data.",
  "Continuing education totals are shareable without revealing session-by-session personal notes.",
];

export const employerVerificationChecks = [
  "Credential ID matches an active Edunancial record.",
  "Issue and validity dates are current and visible.",
  "Evidence summary confirms the skill pathway or passport milestone.",
  "Public profile shares only the minimum fields required for trust and hiring review.",
];

export const verificationRecords: VerificationRecord[] = [
  {
    recordId: learnerProfile.passportId,
    learnerName: learnerProfile.displayName,
    title: "Financial Competency Passport",
    issuedOn: "Jun 1, 2026",
    status: "Verified",
    evidence: "Verified against Edunancial passport registry and continuing education ledger.",
  },
  ...passportCertificates.map((certificate) => ({
    recordId: certificate.credentialId,
    learnerName: learnerProfile.displayName,
    title: certificate.title,
    issuedOn: certificate.issuedOn,
    status: certificate.status,
    evidence: `Verified certificate covering ${certificate.skillAreas.join(", ")}.`,
  })),
];

export function getVerificationRecord(recordId?: string | null) {
  if (!recordId) {
    return null;
  }

  return (
    verificationRecords.find(
      (record) => record.recordId.toLowerCase() === recordId.toLowerCase()
    ) ?? null
  );
}

export function getPublicProfile(slug: string) {
  if (slug !== publicProfile.slug) {
    return null;
  }

  return publicProfile;
}
