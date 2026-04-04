import { useAppStore } from "../state/useAppStore";
import { getTopCategoryData } from "../utils/calculations";
import { formatCurrency } from "../utils/formatCurrency";

const cardClassName =
  "p-5 bg-white dark:bg-slate-800/80 shadow-sm border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm rounded-2xl border-l-4 border-l-orange-500";

const TopCategory = () => {
  const transactions = useAppStore((state) => state.transactions);
  const { topCategory, topCategoryAmount, percentage } = getTopCategoryData(transactions);

  if (!transactions.length) {
    return (
      <div className={cardClassName}>
        <p className="text-sm text-slate-500 dark:text-slate-400">Top Spending Category</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">No data available</p>
      </div>
    );
  }

  return (
    <div className={cardClassName}>
      <p className="text-sm text-slate-500 dark:text-slate-400">Top Spending Category</p>
      <p className="text-2xl font-bold text-orange-500 mt-1">{topCategory}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {formatCurrency(topCategoryAmount)} spent · {percentage}% of total
      </p>
    </div>
  );
};

export default TopCategory;