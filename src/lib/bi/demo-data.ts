import {
  type EnterpriseBIData,
  type ExportFormat,
  type KpiMetric,
  type ReportPeriod,
  type ReportRange,
} from "@/lib/bi/types";

export const REPORT_PERIOD_OPTIONS: Array<{
  value: ReportPeriod;
  label: string;
}> = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "quarter", label: "Quarterly" },
  { value: "year", label: "Annual" },
  { value: "custom", label: "Custom range" },
];

export const EXPORT_FORMAT_OPTIONS: Array<{
  value: ExportFormat;
  label: string;
}> = [
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel" },
];

const executiveMetrics: KpiMetric[] = [
  {
    label: "Total Members",
    value: "1.24M",
    delta: "+8.4%",
    direction: "up",
    context: "All-time enrolled members across every membership tier.",
  },
  {
    label: "Active Members",
    value: "842K",
    delta: "+5.1%",
    direction: "up",
    context: "Members active within the last 30 days.",
  },
  {
    label: "New Members",
    value: "28.6K",
    delta: "+12.3%",
    direction: "up",
    context: "New members added during the selected reporting window.",
  },
  {
    label: "MRR",
    value: "$4.82M",
    delta: "+6.8%",
    direction: "up",
    context: "Monthly recurring subscription revenue.",
  },
  {
    label: "ARR",
    value: "$57.8M",
    delta: "+7.4%",
    direction: "up",
    context: "Projected annual recurring revenue based on current subscriptions.",
  },
  {
    label: "Churn Rate",
    value: "2.7%",
    delta: "-0.4 pts",
    direction: "up",
    context: "Improved member retention compared with the prior period.",
  },
  {
    label: "LTV",
    value: "$1,940",
    delta: "+4.9%",
    direction: "up",
    context: "Estimated lifetime value per paying member.",
  },
  {
    label: "CAC",
    value: "$142",
    delta: "-3.6%",
    direction: "up",
    context: "Blended acquisition cost across paid and organic channels.",
  },
  {
    label: "Revenue Growth",
    value: "18.2%",
    delta: "+2.1 pts",
    direction: "up",
    context: "Year-over-year recognized revenue growth.",
  },
  {
    label: "Conversion Rate",
    value: "6.4%",
    delta: "+0.7 pts",
    direction: "up",
    context: "Visitor-to-member conversion across acquisition funnels.",
  },
];

export function normalizeReportPeriod(value?: string): ReportPeriod {
  if (
    value === "day" ||
    value === "week" ||
    value === "month" ||
    value === "quarter" ||
    value === "year" ||
    value === "custom"
  ) {
    return value;
  }

  return "month";
}

export function buildReportRange(
  periodValue?: string,
  startDate?: string,
  endDate?: string,
): ReportRange {
  const period = normalizeReportPeriod(periodValue);

  if (period === "custom" && startDate && endDate) {
    return {
      period,
      startDate,
      endDate,
      label: `${startDate} to ${endDate}`,
    };
  }

  const labels: Record<Exclude<ReportPeriod, "custom">, string> = {
    day: "Daily snapshot",
    week: "Last 7 days",
    month: "Last 30 days",
    quarter: "Current quarter",
    year: "Trailing 12 months",
  };

  return {
    period,
    label:
      period === "custom"
        ? "Choose a start and end date to generate a custom report."
        : labels[period],
  };
}

export function getEnterpriseBIData(
  periodValue?: string,
  startDate?: string,
  endDate?: string,
): EnterpriseBIData {
  const range = buildReportRange(periodValue, startDate, endDate);

  return {
    generatedAt: "2026-07-10 00:00 UTC",
    range,
    executiveMetrics,
    executiveRevenueTrend: [
      { label: "Jan", value: 3.8 },
      { label: "Feb", value: 4.1 },
      { label: "Mar", value: 4.2 },
      { label: "Apr", value: 4.4 },
      { label: "May", value: 4.6 },
      { label: "Jun", value: 4.82 },
    ],
    executiveConversionMix: [
      { label: "Organic", value: 38, color: "#2563eb" },
      { label: "Paid", value: 27, color: "#10b981" },
      { label: "Email", value: 19, color: "#f59e0b" },
      { label: "AI referrals", value: 16, color: "#ec4899" },
    ],
    learningMetrics: [
      {
        label: "Course Enrollments",
        value: "412K",
        delta: "+9.8%",
        direction: "up",
        context: "Active enrollments across all learning tracks.",
      },
      {
        label: "Course Completion Rate",
        value: "74%",
        delta: "+3.2 pts",
        direction: "up",
        context: "Learners reaching final module completion.",
      },
      {
        label: "Lesson Completion",
        value: "81%",
        delta: "+2.5 pts",
        direction: "up",
        context: "Average lesson completion across enrolled members.",
      },
      {
        label: "Quiz Performance",
        value: "88%",
        delta: "+1.7 pts",
        direction: "up",
        context: "Average passing score across graded assessments.",
      },
      {
        label: "Learning Hours",
        value: "2.9M",
        delta: "+10.6%",
        direction: "up",
        context: "Total member learning hours in the reporting window.",
      },
      {
        label: "Learning Streaks",
        value: "146K",
        delta: "+14.1%",
        direction: "up",
        context: "Members maintaining a seven-day or longer streak.",
      },
      {
        label: "Certificates Earned",
        value: "68.4K",
        delta: "+11.2%",
        direction: "up",
        context: "Certificates issued after verified learning completion.",
      },
    ],
    learningHoursTrend: [
      { label: "Week 1", value: 420 },
      { label: "Week 2", value: 455 },
      { label: "Week 3", value: 476 },
      { label: "Week 4", value: 501 },
      { label: "Week 5", value: 533 },
      { label: "Week 6", value: 562 },
    ],
    learningCourseRankings: [
      {
        course: "Business Builder Blueprint",
        enrollments: 58200,
        completionRate: "83%",
        avgQuizScore: "91%",
      },
      {
        course: "Real Estate Fundamentals",
        enrollments: 54860,
        completionRate: "79%",
        avgQuizScore: "89%",
      },
      {
        course: "Paper Assets Mastery",
        enrollments: 51420,
        completionRate: "76%",
        avgQuizScore: "87%",
      },
    ],
    leastCompletedCourses: [
      {
        course: "Global Expansion Lab",
        enrollments: 14280,
        completionRate: "44%",
        avgQuizScore: "72%",
      },
      {
        course: "Advanced Treasury Operations",
        enrollments: 11840,
        completionRate: "47%",
        avgQuizScore: "74%",
      },
      {
        course: "Cross-Border Finance Systems",
        enrollments: 10925,
        completionRate: "49%",
        avgQuizScore: "76%",
      },
    ],
    financialMetrics: [
      {
        label: "Subscription Revenue",
        value: "$5.36M",
        delta: "+7.9%",
        direction: "up",
        context: "Recognized subscription revenue in the active period.",
      },
      {
        label: "Payment Success Rate",
        value: "97.8%",
        delta: "+0.6 pts",
        direction: "up",
        context: "Successful recurring and one-time payment attempts.",
      },
      {
        label: "Failed Payments",
        value: "6,412",
        delta: "-8.7%",
        direction: "up",
        context: "Failed card, ACH, and wallet payment attempts.",
      },
      {
        label: "Refunds",
        value: "$86.4K",
        delta: "-5.4%",
        direction: "up",
        context: "Refund volume issued across paid products.",
      },
      {
        label: "Membership Upgrades",
        value: "9,860",
        delta: "+12.8%",
        direction: "up",
        context: "Members moving into higher-value plans.",
      },
      {
        label: "Membership Downgrades",
        value: "2,184",
        delta: "-2.9%",
        direction: "up",
        context: "Members moving into lower-priced plans.",
      },
      {
        label: "Trial Conversions",
        value: "42.6%",
        delta: "+1.4 pts",
        direction: "up",
        context: "Trial members converting to a paid membership.",
      },
      {
        label: "Revenue Forecasting",
        value: "$6.08M",
        delta: "Next 30 days",
        direction: "neutral",
        context: "Demo projection prepared for future predictive models.",
      },
    ],
    financialRevenueForecast: [
      { label: "Now", value: 5.36 },
      { label: "+30d", value: 5.58 },
      { label: "+60d", value: 5.76 },
      { label: "+90d", value: 6.08 },
    ],
    financialPaymentMix: [
      { label: "Card", value: 62, color: "#2563eb" },
      { label: "ACH", value: 21, color: "#10b981" },
      { label: "Wallets", value: 12, color: "#f59e0b" },
      { label: "Invoice", value: 5, color: "#ef4444" },
    ],
    marketingMetrics: [
      {
        label: "Website Traffic",
        value: "3.8M",
        delta: "+16.2%",
        direction: "up",
        context: "Sessions across site, app, and campaign landing pages.",
      },
      {
        label: "Organic Search",
        value: "1.41M",
        delta: "+9.3%",
        direction: "up",
        context: "Sessions generated from unpaid search results.",
      },
      {
        label: "AI Referral Traffic",
        value: "248K",
        delta: "+24.8%",
        direction: "up",
        context: "Traffic attributed to AI assistants and answer engines.",
      },
      {
        label: "Email Campaign CTR",
        value: "8.9%",
        delta: "+1.1 pts",
        direction: "up",
        context: "Click-through rate across lifecycle and newsletter sends.",
      },
      {
        label: "Landing Page Conversion",
        value: "14.3%",
        delta: "+2.3 pts",
        direction: "up",
        context: "Visitors completing the primary CTA on campaign pages.",
      },
      {
        label: "Campaign ROI",
        value: "4.6x",
        delta: "+0.8x",
        direction: "up",
        context: "Return on spend across all active acquisition campaigns.",
      },
    ],
    marketingTrafficTrend: [
      { label: "Jan", value: 2.9 },
      { label: "Feb", value: 3.0 },
      { label: "Mar", value: 3.2 },
      { label: "Apr", value: 3.35 },
      { label: "May", value: 3.58 },
      { label: "Jun", value: 3.8 },
    ],
    marketingReferralMix: [
      { label: "Organic", value: 37, color: "#2563eb" },
      { label: "Email", value: 18, color: "#14b8a6" },
      { label: "AI referral", value: 12, color: "#f97316" },
      { label: "Direct", value: 20, color: "#8b5cf6" },
      { label: "Paid social", value: 13, color: "#ec4899" },
    ],
    marketingFunnel: [
      { label: "Visitors", value: 3800000, conversion: "100%" },
      { label: "Lead captures", value: 612000, conversion: "16.1%" },
      { label: "Trials", value: 168000, conversion: "27.5%" },
      { label: "Paid members", value: 71600, conversion: "42.6%" },
    ],
    operationalMetrics: [
      {
        label: "System Uptime",
        value: "99.98%",
        delta: "+0.02 pts",
        direction: "up",
        context: "Rolling 30-day availability across core services.",
      },
      {
        label: "API Performance",
        value: "182ms",
        delta: "-14ms",
        direction: "up",
        context: "Median API latency for member-facing endpoints.",
      },
      {
        label: "Error Rate",
        value: "0.18%",
        delta: "-0.05 pts",
        direction: "up",
        context: "Application and API errors per request volume.",
      },
      {
        label: "Support SLA",
        value: "94%",
        delta: "+3.4 pts",
        direction: "up",
        context: "Tickets resolved within the committed support window.",
      },
      {
        label: "Security Alerts",
        value: "3",
        delta: "2 resolved",
        direction: "neutral",
        context: "Open high-priority alerts requiring follow-up.",
      },
      {
        label: "Backup Status",
        value: "Healthy",
        delta: "RPO < 10m",
        direction: "up",
        context: "Nightly full and incremental backup health.",
      },
      {
        label: "Deployments",
        value: "28",
        delta: "+6",
        direction: "up",
        context: "Successful production deployments this month.",
      },
      {
        label: "Platform Health",
        value: "Green",
        delta: "All core services",
        direction: "up",
        context: "Composite service status across product, data, and API layers.",
      },
    ],
    operationalApiLatency: [
      { label: "Auth", value: 170 },
      { label: "Learning", value: 196 },
      { label: "Payments", value: 189 },
      { label: "Reports", value: 203 },
      { label: "Content", value: 154 },
    ],
    operationalEvents: [
      {
        event: "Primary region deploy",
        status: "Completed",
        owner: "Platform engineering",
        timestamp: "2026-07-09 23:10 UTC",
      },
      {
        event: "Security ruleset review",
        status: "In progress",
        owner: "Security operations",
        timestamp: "2026-07-09 21:45 UTC",
      },
      {
        event: "Backup verification",
        status: "Passed",
        owner: "Infrastructure",
        timestamp: "2026-07-09 20:05 UTC",
      },
      {
        event: "Support queue sweep",
        status: "Completed",
        owner: "Member success",
        timestamp: "2026-07-09 19:40 UTC",
      },
    ],
    reportPacks: [
      {
        title: "Executive board pack",
        description: "Top-line growth, retention, financial health, and risks.",
        audience: "Executives and board observers",
        cadence: "Daily / weekly / monthly",
      },
      {
        title: "Learning operations pack",
        description: "Enrollment health, completion trends, and course quality.",
        audience: "Admins and instructors",
        cadence: "Weekly / monthly / quarterly",
      },
      {
        title: "Revenue and billing pack",
        description: "Subscription performance, recoveries, and forecast outlook.",
        audience: "Finance and operations",
        cadence: "Daily / monthly / annual",
      },
      {
        title: "Growth marketing pack",
        description: "Channel mix, funnel performance, and campaign ROI.",
        audience: "Marketing and partnerships",
        cadence: "Weekly / monthly / custom",
      },
    ],
    aiInterfaces: [
      {
        name: "Predictive analytics",
        description: "Reserved service contract for trend prediction and cohort modeling.",
        output: "Demand, retention, and pacing forecasts",
        status: "placeholder",
      },
      {
        name: "Churn prediction",
        description: "Future-risk scoring endpoint for member retention workflows.",
        output: "At-risk member cohorts",
        status: "placeholder",
      },
      {
        name: "Revenue forecasting",
        description: "Forecast adapter for scenario planning and revenue sensitivity analysis.",
        output: "Baseline, optimistic, and downside forecasts",
        status: "placeholder",
      },
      {
        name: "Learning recommendations",
        description: "Recommendation interface for next-best lessons, quizzes, and certificates.",
        output: "Personalized learning paths",
        status: "placeholder",
      },
      {
        name: "Marketing optimization",
        description: "Future optimizer contract for channel mix and audience targeting.",
        output: "Budget allocation suggestions",
        status: "placeholder",
      },
      {
        name: "Executive summaries",
        description: "Narrative summary renderer for periodic leadership briefings.",
        output: "Automated plain-language summaries",
        status: "placeholder",
      },
      {
        name: "Automated anomaly detection",
        description: "Outlier detection interface for financial, product, and ops telemetry.",
        output: "Severity-scored anomaly alerts",
        status: "placeholder",
      },
    ],
    integrations: [
      {
        name: "Warehouse-ready data contracts",
        status: "Ready",
        detail: "Section data is normalized for future warehouse ingestion and semantic modeling.",
      },
      {
        name: "Power BI / Tableau adapter layer",
        status: "Ready",
        detail: "Export schema and section packs are aligned for downstream BI connectors.",
      },
      {
        name: "Heat map dimensions",
        status: "Prepared",
        detail: "Geography, cohort, and engagement dimensions are reserved for future density views.",
      },
    ],
  };
}
