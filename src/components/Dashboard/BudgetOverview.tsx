import { useAppStore } from "../state/useAppStore";
import { getTotalExpense } from "../utils/calculations";
import { formatCurrency } from "../utils/formatCurrency";
import Card from "../Common/Card";
import { Target } from "lucide-react";

const MONTHLY_BUDGET = 30000;

const BudgetOverview = () => {
  const totalSpent = getTotalExpense(useAppStore((state) => state.transactions));
  const remaining = MONTHLY_BUDGET - totalSpent;
  const usedPercent = Math.min(Math.round((totalSpent / MONTHLY_BUDGET) * 100), 100);
  const isOverBudget = totalSpent > MONTHLY_BUDGET;

  const progressColor = isOverBudget
    ? "from-rose-400 to-rose-600"
    : usedPercent > 75
    ? "from-amber-400 to-amber-500"
    : "from-indigo-400 to-indigo-600";

  const budgetRows: [string, number, string][] = [
    ["Budget", MONTHLY_BUDGET, ""],
    ["Spent", totalSpent, isOverBudget ? "text-rose-500" : ""],
    ["Remaining", remaining, isOverBudget ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"],
  ];

  return (
    <Card className="animate-fade-in-up animation-delay-400">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Budget Overview</h3>
      </div>
      {budgetRows.map(([label, amount, colorClass]) => (
        <div key={label} className="flex justify-between text-sm mb-1.5">
          <span className="text-slate-500 dark:text-slate-400">{label}</span>
          <span className={`font-medium text-slate-700 dark:text-slate-200 ${colorClass}`}>
            {formatCurrency(amount)}
          </span>
        </div>
      ))}
      <div className="w-full bg-slate-100 dark:bg-slate-700/50 h-2.5 rounded-full overflow-hidden mt-3">
        <div
          className={`h-full rounded-full animate-progress-fill bg-gradient-to-r ${progressColor}`}
          style={{ width: `${usedPercent}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-right font-medium">
        {usedPercent}% used
      </p>
    </Card>
  );
};

export default BudgetOverview;