import { useAppStore } from "../state/useAppStore";
import { getBalance, getSavingsRate, getMonthlyBreakdown } from "../utils/calculations";
import { formatCurrency } from "../utils/formatCurrency";
import TopCategory from "./TopCategory";
import MonthlyComparison from "./MonthlyComparison";

const cardClassName =
  "p-5 bg-white dark:bg-slate-800/80 shadow-sm border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm rounded-2xl border-l-4";

const InsightsPanel = () => {
  const transactions = useAppStore((state) => state.transactions);
  const balance = getBalance(transactions);
  const savingsRate = getSavingsRate(transactions);
  const monthlyEntries = Object.entries(getMonthlyBreakdown(transactions)).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  if (!transactions.length) {
    return (
      <div className={`${cardClassName} border-l-slate-300 mt-6`}>
        <h2 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100">Insights</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">No data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopCategory />
        <MonthlyComparison />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${cardClassName} border-l-blue-500`}>
          <p className="text-sm text-slate-500 dark:text-slate-400">Savings Rate</p>
          <p
            className={`text-2xl font-bold mt-1 ${
              savingsRate >= 20 ? "text-blue-600 dark:text-blue-400" : "text-rose-500"
            }`}
          >
            {savingsRate}%
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {savingsRate >= 20 ? "On track" : "Below 20% target"}
          </p>
        </div>
        <div className={`${cardClassName} border-l-emerald-500`}>
          <p className="text-sm text-slate-500 dark:text-slate-400">Net Balance</p>
          <p
            className={`text-2xl font-bold mt-1 ${
              balance >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {balance >= 0 ? "Positive cashflow" : "Negative cashflow"}
          </p>
        </div>
      </div>

      {monthlyEntries.length > 0 && (
        <div className="p-6 bg-white dark:bg-slate-800/80 shadow-sm border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm rounded-2xl">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4">
            Monthly Breakdown
          </h3>
          <div className="space-y-3">
            {monthlyEntries.map(([month, data]) => {
              const netAmount = data.income - data.expense;
              return (
                <div
                  key={month}
                  className="flex flex-col sm:flex-row sm:items-center justify-between text-sm border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0 gap-1 sm:gap-0"
                >
                  <span className="text-slate-500 dark:text-slate-400 font-medium min-w-[5rem]">
                    {month}
                  </span>
                  <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(data.income)}
                    </span>
                    <span className="text-rose-500">-{formatCurrency(data.expense)}</span>
                    <span
                      className={`font-bold ${
                        netAmount >= 0
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {formatCurrency(netAmount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;