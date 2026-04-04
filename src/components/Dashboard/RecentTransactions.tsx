import { useAppStore } from "../state/useAppStore";
import Card from "../Common/Card";
import { ArrowRightLeft, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

const RecentTransactions = () => {
  const transactions = useAppStore((state) => state.transactions);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const recentItems = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  if (!recentItems.length) return null;

  return (
    <Card className="animate-fade-in-up animation-delay-400">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Recent Transactions
          </h3>
        </div>
        <button
          onClick={() => setActiveTab("transactions")}
          className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors cursor-pointer"
        >
          View All
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-3">
        {recentItems.map((transaction, index) => {
          const isIncome = transaction.type === "income";
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    isIncome
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isIncome ? "+" : "−"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {transaction.category} · {transaction.date}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold whitespace-nowrap ml-3 ${
                  isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                }`}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentTransactions;
