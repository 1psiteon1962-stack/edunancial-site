import { getEnterpriseBIData } from "@/lib/bi/demo-data";
import type { EnterpriseBIData, ExportFormat, KpiMetric } from "@/lib/bi/types";

interface ReportRow {
  category: string;
  metric: string;
  value: string;
  change: string;
  detail: string;
}

function escapeCsv(value: string) {
  const normalized = value.replace(/"/g, '""');
  return `"${normalized}"`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapePdf(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function rowsFromMetrics(category: string, metrics: KpiMetric[]): ReportRow[] {
  return metrics.map((metric) => ({
    category,
    metric: metric.label,
    value: metric.value,
    change: metric.delta,
    detail: metric.context,
  }));
}

export function buildReportRows(data: EnterpriseBIData): ReportRow[] {
  return [
    ...rowsFromMetrics("Executive", data.executiveMetrics),
    ...rowsFromMetrics("Learning", data.learningMetrics),
    ...rowsFromMetrics("Financial", data.financialMetrics),
    ...rowsFromMetrics("Marketing", data.marketingMetrics),
    ...rowsFromMetrics("Operational", data.operationalMetrics),
    ...data.aiInterfaces.map((item) => ({
      category: "AI-ready interface",
      metric: item.name,
      value: item.status,
      change: item.output,
      detail: item.description,
    })),
    ...data.integrations.map((item) => ({
      category: "Integration readiness",
      metric: item.name,
      value: item.status,
      change: "",
      detail: item.detail,
    })),
  ];
}

export function renderCsv(rows: ReportRow[]) {
  const header = ["Category", "Metric", "Value", "Change", "Detail"];
  const lines = [
    header.map(escapeCsv).join(","),
    ...rows.map((row) =>
      [row.category, row.metric, row.value, row.change, row.detail]
        .map(escapeCsv)
        .join(","),
    ),
  ];

  return lines.join("\n");
}

export function renderSpreadsheetXml(rows: ReportRow[]) {
  const cells = rows
    .map(
      (row) => `
      <Row>
        <Cell><Data ss:Type="String">${escapeXml(row.category)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(row.metric)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(row.value)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(row.change)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(row.detail)}</Data></Cell>
      </Row>`,
    )
    .join("");

  return `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="BI Report">
    <Table>
      <Row>
        <Cell><Data ss:Type="String">Category</Data></Cell>
        <Cell><Data ss:Type="String">Metric</Data></Cell>
        <Cell><Data ss:Type="String">Value</Data></Cell>
        <Cell><Data ss:Type="String">Change</Data></Cell>
        <Cell><Data ss:Type="String">Detail</Data></Cell>
      </Row>
      ${cells}
    </Table>
  </Worksheet>
</Workbook>`;
}

export function renderPdfDocument(data: EnterpriseBIData, rows: ReportRow[]) {
  const lines = [
    "Edunancial Enterprise BI Report",
    `Reporting window: ${data.range.label}`,
    `Generated at: ${data.generatedAt}`,
    "",
    ...rows.slice(0, 24).map(
      (row) => `${row.category} | ${row.metric}: ${row.value} (${row.change || "n/a"})`,
    ),
  ];

  const content = [
    "BT",
    "/F1 16 Tf",
    "40 790 Td",
    ...lines.flatMap((line, index) => [
      index === 0 ? `(${escapePdf(line)}) Tj` : "0 -24 Td",
      index === 0 ? "" : `(${escapePdf(line)}) Tj`,
    ]),
    "ET",
  ]
    .filter(Boolean)
    .join("\n");

  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  }

  const xrefPosition = pdf.length;

  pdf += `xref
0 ${objects.length + 1}
0000000000 65535 f 
${offsets.map((offset) => `${offset.toString().padStart(10, "0")} 00000 n `).join("\n")}
trailer << /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xrefPosition}
%%EOF`;

  return pdf;
}

export function buildExportFilename(
  format: ExportFormat,
  period?: string,
  startDate?: string,
  endDate?: string,
) {
  const suffix =
    period === "custom" && startDate && endDate
      ? `${startDate}_to_${endDate}`
      : period || "month";

  return `edunancial-bi-report-${suffix}.${format === "xlsx" ? "xls" : format}`;
}

export function buildExportPayload(
  format: ExportFormat,
  period?: string,
  startDate?: string,
  endDate?: string,
) {
  const data = getEnterpriseBIData(period, startDate, endDate);
  const rows = buildReportRows(data);

  if (format === "csv") {
    return {
      body: renderCsv(rows),
      contentType: "text/csv; charset=utf-8",
    };
  }

  if (format === "xlsx") {
    return {
      body: renderSpreadsheetXml(rows),
      contentType: "application/vnd.ms-excel; charset=utf-8",
    };
  }

  return {
    body: renderPdfDocument(data, rows),
    contentType: "application/pdf",
  };
}
