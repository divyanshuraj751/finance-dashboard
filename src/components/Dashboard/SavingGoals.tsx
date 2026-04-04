import { useAppStore } from "../state/useAppStore";
import { getBalance } from "../utils/calculations";
import { formatCurrency } from "../utils/formatCurrency";
import Card from "../Common/Card";
import { PiggyBank } from "lucide-react";

const SAVINGS_GOAL = 100000;

const SavingGoals = () => {
  const totalSavings = getBalance(useAppStore((state) => state.transactions));
  const progressPercent = Math.min(Math.round((totalSavings / SAVINGS_GOAL) * 100), 100);
  const isNegative = totalSavings < 0;

  const savingsRows: [string, number, string][] = [
    ["Goal", SAVINGS_GOAL, ""],
    ["Saved", totalSavings, isNegative ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"],
  ];

  return (
    <Card className="animate-fade-in-up animation-delay-500">
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Savings Goal</h3>
      </div>
      {savingsRows.map(([label, amount, colorClass]) => (
        <div key={label} className="flex justify-between text-sm mb-1.5">
          <span className="text-slate-500 dark:text-slate-400">{label}</span>
          <span className={`font-semibold text-slate-700 dark:text-slate-200 ${colorClass}`}>
            {formatCurrency(amount)}
          </span>
        </div>
      ))}
      <div className="w-full bg-slate-100 dark:bg-slate-700/50 h-2.5 rounded-full overflow-hidden mt-3">
        <div
          className={`h-full rounded-full animate-progress-fill bg-gradient-to-r ${
            isNegative ? "from-rose-400 to-rose-500" : "from-emerald-400 to-emerald-600"
          }`}
          style={{ width: `${isNegative ? 0 : progressPercent}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-right font-medium">
        {isNegative ? "Below zero" : `${progressPercent}% of goal reached`}
      </p>
    </Card>
  );
};

export default SavingGoals;