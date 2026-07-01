import BalanceSheetDashboard from "./BalanceSheetDashboard";
import ProfitLossDashboard from "./ProfitLossDashboard";
import CashFlowDashboard from "./CashFlowDashboard";
import ChartOfAccounts from "./ChartOfAccounts";

export default function AccountingDashboard(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<BalanceSheetDashboard/>

<ProfitLossDashboard/>

<CashFlowDashboard/>

<ChartOfAccounts/>

</main>

);

}
