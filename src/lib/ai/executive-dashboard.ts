import { getCEODashboard } from "./ceo-agent";
import { getOperationsStatus } from "./coo-agent";
import { getFinancialSummary } from "./cfo-agent";
import { getTechnologyHealth } from "./cio-agent";
import { getTreasurySnapshot } from "./treasury-agent";
import { getExecutiveSummary } from "./executive-agent";

export function getExecutiveDashboard() {

  return {

    ceo: getCEODashboard(),

    operations: getOperationsStatus(),

    finance: getFinancialSummary(),

    technology: getTechnologyHealth(),

    treasury: getTreasurySnapshot(),

    executiveSummary: getExecutiveSummary(),

    generatedAt: new Date(),

  };

}
