import { useAppStore } from "../state/useAppStore";
import { formatCurrency } from "../utils/formatCurrency";
import { getMonthlyBreakdown } from "../utils/calculations";

const cardClassName =
  "p-5 bg-white dark:bg-slate-800/80 shadow-sm border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm rounded-2xl border-l-4 border-l-blue-500";

const MonthlyComparison = () => {
  const transactions = useAppStore((state) => state.transactions);

  if (!transactions.length) {
    return (
      <div className={cardClassName}>
        <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Comparison</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">No data available</p>
      </div>
    );
  }

  const now = new Date();
  const currentMonthKey = now.toISOString().slice(0, 7);
  const previousMonthKey = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
  const monthlyData = getMonthlyBreakdown(transactions);
  const currentExpense = monthlyData[currentMonthKey]?.expense || 0;
  const previousExpense = monthlyData[previousMonthKey]?.expense || 0;
  const currentIncome = monthlyData[currentMonthKey]?.income || 0;
  const previousIncome = monthlyData[previousMonthKey]?.income || 0;
  const expenseDiff = currentExpense - previousExpense;
  const incomeDiff = currentIncome - previousIncome;

  const renderBadge = (diff: number, previousValue: number, isPositiveGood: boolean) => {
    const isUp = diff > 0;
    const colorClass = (isPositiveGood ? isUp : !isUp)
      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
      : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400";
    return (
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full ${
          diff === 0
            ? "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
            : colorClass
        }`}
      >
        {isUp ? "+" : ""}
        {previousValue > 0 ? Math.round((diff / previousValue) * 100) + "%" : "—"}
      </span>
    );
  };

  const ComparisonRow = ({
    label,
    currentValue,
    previousValue,
    diff,
    isPositiveGood,
  }: {
    label: string;
    currentValue: number;
    previousValue: number;
    diff: number;
    isPositiveGood: boolean;
  }) => (
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{label}</p>
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="text-slate-400 dark:text-slate-500 text-xs">This month </span>
          <span
            className={`font-bold ${
              isPositiveGood
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {formatCurrency(currentValue)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500 text-xs">Last month </span>
          <span
            className={`font-medium ${
              isPositiveGood
                ? "text-emerald-400 dark:text-emerald-500"
                : "text-rose-400 dark:text-rose-500"
            }`}
          >
            {formatCurrency(previousValue)}
          </span>
        </div>
        {renderBadge(diff, previousValue, isPositiveGood)}
      </div>
    </div>
  );

  return (
    <div className={cardClassName}>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Monthly Comparison</p>
      <div className="space-y-4">
        <ComparisonRow
          label="Expenses"
          currentValue={currentExpense}
          previousValue={previousExpense}
          diff={expenseDiff}
          isPositiveGood={false}
        />
        <ComparisonRow
          label="Income"
          currentValue={currentIncome}
          previousValue={previousIncome}
          diff={incomeDiff}
          isPositiveGood={true}
        />
      </div>
    </div>
  );
};

export default MonthlyComparison;