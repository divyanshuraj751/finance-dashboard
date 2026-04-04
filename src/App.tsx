import { useEffect, useState } from "react";
import { useAppStore } from "./components/state/useAppStore";
import { transactions } from "./components/data/transactions";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import ToastContainer from "./components/Common/Toast";
import Sidebar from "./components/Sidebar/Sidebar";
import SummaryCards from "./components/Dashboard/SummaryCards";
import DashboardChart from "./components/Dashboard/DashboardChart";
import DashboardPieChart from "./components/Dashboard/DashboardPieChart";
import BudgetOverview from "./components/Dashboard/BudgetOverview";
import SavingGoals from "./components/Dashboard/SavingGoals";
import RecentTransactions from "./components/Dashboard/RecentTransactions";
import TransactionControls from "./components/Transactions/TransactionControls";
import TransactionTable from "./components/Transactions/TransactionTable";
import InsightsPanel from "./components/Insights/InsightsPanel";
import { Menu, Wallet } from "lucide-react";

function App() {
  const setTransactions = useAppStore((state) => state.setTransactions);
  const activeTab = useAppStore((state) => state.activeTab);
  const existingTransactions = useAppStore((state) => state.transactions);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (existingTransactions.length === 0) {
      setTransactions(transactions);
    }
  }, [setTransactions, existingTransactions.length]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 overflow-auto">
          <div className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-800 dark:text-white">Fintrack</span>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-8 text-slate-800 dark:text-white capitalize">
              {activeTab}
            </h1>

            {activeTab === "dashboard" && (
              <div className="space-y-8">
                <SummaryCards />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <DashboardChart />
                  <DashboardPieChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <RecentTransactions />
                  <BudgetOverview />
                  <SavingGoals />
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-4 animate-fade-in">
                <TransactionControls />
                <TransactionTable />
              </div>
            )}

            {activeTab === "insights" && (
              <div className="animate-fade-in">
                <InsightsPanel />
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;