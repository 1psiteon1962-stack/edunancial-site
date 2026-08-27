export type CertificateCredentialLevel = "completion" | "competency" | "business-readiness";

export interface CertificateCompetencyEvidence {
  competencyId: string;
  label: string;
  status: "demonstrated" | "developing";
  evidenceReference?: string;
}

export interface CertificateReadinessSnapshot {
  educationComplete: boolean;
  mentorshipReady: boolean;
  businessReady: boolean;
  capitalReady: boolean;
  milestoneIds?: string[];
  assessedAt?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  studentName: string;
  courseName: string;
  completedOn: string;
  certificateNumber: string;

  /** Backward-compatible credential metadata for higher-level Edunancial pathways. */
  credentialLevel?: CertificateCredentialLevel;
  track?: string;
  curriculumLevel?: number;
  locale?: string;
  competencies?: CertificateCompetencyEvidence[];
  readiness?: CertificateReadinessSnapshot;
  verificationCode?: string;
  verificationUrl?: string;
}
