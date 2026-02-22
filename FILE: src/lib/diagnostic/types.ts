export type FounderStage =
  | "idea"
  | "pre_revenue"
  | "early_revenue"
  | "scaling"
  | "established";

export type RegionCode = string;

export type DiagnosticAnswer = {
  questionId: string;
  value: string | number | boolean;
};

export type LeadCapturePayload = {
  email: string;
  region: RegionCode;
  stage: FounderStage;
  industry?: string;
  answers: DiagnosticAnswer[];
  score?: number;
  level?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landingPath?: string;
  userAgent?: string;
  clientTs?: string;
};
