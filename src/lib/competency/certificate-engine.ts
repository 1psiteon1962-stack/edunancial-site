/**
 * Competency Passport — Certificate Engine
 *
 * Handles certificate metadata, download URL construction,
 * and shareable certificate link generation.
 * Region-agnostic; base URL is injected via RegionPassportConfig.
 */

import { PassportCertificate, RegionPassportConfig } from "./types";
import { CompetencyScores } from "@/lib/assessment/scoring";

// ─── Certificate catalog ──────────────────────────────────────────────────────

interface CertificateDef {
  id: string;
  title: string;
  category: string;
  competencyArea: keyof CompetencyScores;
  minimumScore: number;
}

const CERTIFICATE_DEFINITIONS: CertificateDef[] = [
  {
    id: "personal-finance",
    title: "Personal Financial Management",
    category: "Personal Finance",
    competencyArea: "personalFinance",
    minimumScore: 80,
  },
  {
    id: "investing",
    title: "Investing Fundamentals",
    category: "Paper Assets",
    competencyArea: "investing",
    minimumScore: 80,
  },
  {
    id: "real-estate",
    title: "Real Estate Foundations",
    category: "Real Estate",
    competencyArea: "realEstate",
    minimumScore: 80,
  },
  {
    id: "business",
    title: "Business Fundamentals",
    category: "Business",
    competencyArea: "business",
    minimumScore: 80,
  },
  {
    id: "risk-management",
    title: "Risk Management",
    category: "Risk",
    competencyArea: "riskManagement",
    minimumScore: 80,
  },
  {
    id: "financial-competency",
    title: "Financial Competency",
    category: "Overall",
    competencyArea: "overall",
    minimumScore: 85,
  },
];

// ─── URL Helpers ──────────────────────────────────────────────────────────────

export function buildCertificateDownloadUrl(
  certificateId: string,
  memberId: string,
  baseUrl: string
): string {
  return `${baseUrl}/${certificateId}/download?member=${encodeURIComponent(memberId)}`;
}

export function buildCertificateShareUrl(
  certificateId: string,
  memberId: string,
  baseUrl: string
): string {
  return `${baseUrl}/${certificateId}/verify?member=${encodeURIComponent(memberId)}`;
}

// ─── Certificate Generation ───────────────────────────────────────────────────

export function generatePassportCertificates(
  scores: CompetencyScores,
  memberId: string,
  recipientName: string,
  config: Pick<RegionPassportConfig, "certificateBaseUrl">
): PassportCertificate[] {
  const issuedDate = new Date().toLocaleDateString();

  return CERTIFICATE_DEFINITIONS.map((def) => {
    const score = scores[def.competencyArea as keyof CompetencyScores];
    const earned = score >= def.minimumScore;

    return {
      id: def.id,
      title: def.title,
      category: def.category,
      issuedDate: earned ? issuedDate : "",
      recipientName,
      competencyArea: def.competencyArea,
      score,
      downloadUrl: earned
        ? buildCertificateDownloadUrl(def.id, memberId, config.certificateBaseUrl)
        : "",
      shareUrl: earned
        ? buildCertificateShareUrl(def.id, memberId, config.certificateBaseUrl)
        : "",
    };
  });
}

export function getEarnedCertificates(
  certificates: PassportCertificate[]
): PassportCertificate[] {
  return certificates.filter((c) => c.downloadUrl !== "");
}

export function countEarnedCertificates(
  certificates: PassportCertificate[]
): number {
  return getEarnedCertificates(certificates).length;
}
