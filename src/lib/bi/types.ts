export type TrendDirection = "up" | "down" | "neutral";

export type ReportPeriod =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";

export type ExportFormat = "csv" | "pdf" | "xlsx";

export interface KpiMetric {
  label: string;
  value: string;
  delta: string;
  direction: TrendDirection;
  context: string;
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface PieSegment {
  label: string;
  value: number;
  color: string;
}

export interface CoursePerformance {
  course: string;
  enrollments: number;
  completionRate: string;
  avgQuizScore: string;
}

export interface FunnelStep {
  label: string;
  value: number;
  conversion: string;
}

export interface OperationalEvent {
  event: string;
  status: string;
  owner: string;
  timestamp: string;
}

export interface ReportPack {
  title: string;
  description: string;
  audience: string;
  cadence: string;
}

export interface AIAnalyticsInterface {
  name: string;
  description: string;
  output: string;
  status: "placeholder";
}

export interface IntegrationReadiness {
  name: string;
  status: string;
  detail: string;
}

export interface ReportRange {
  period: ReportPeriod;
  startDate?: string;
  endDate?: string;
  label: string;
}

export interface EnterpriseBIData {
  generatedAt: string;
  range: ReportRange;
  executiveMetrics: KpiMetric[];
  executiveRevenueTrend: SeriesPoint[];
  executiveConversionMix: PieSegment[];
  learningMetrics: KpiMetric[];
  learningHoursTrend: SeriesPoint[];
  learningCourseRankings: CoursePerformance[];
  leastCompletedCourses: CoursePerformance[];
  financialMetrics: KpiMetric[];
  financialRevenueForecast: SeriesPoint[];
  financialPaymentMix: PieSegment[];
  marketingMetrics: KpiMetric[];
  marketingTrafficTrend: SeriesPoint[];
  marketingReferralMix: PieSegment[];
  marketingFunnel: FunnelStep[];
  operationalMetrics: KpiMetric[];
  operationalApiLatency: SeriesPoint[];
  operationalEvents: OperationalEvent[];
  reportPacks: ReportPack[];
  aiInterfaces: AIAnalyticsInterface[];
  integrations: IntegrationReadiness[];
}
