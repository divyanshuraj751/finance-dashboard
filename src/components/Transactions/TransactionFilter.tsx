import { useAppStore } from "../state/useAppStore";
import type { TransactionType } from "../types";

const selectClassName =
  "p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all";

const TransactionFilter = () => {
  const { type, category } = useAppStore((state) => state.filters);
  const setFilters = useAppStore((state) => state.setFilters);
  const resetFilters = useAppStore((state) => state.resetFilters);
  const categories = [
    ...new Set(useAppStore((state) => state.transactions).map((transaction) => transaction.category)),
  ].sort();

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select
        className={selectClassName}
        value={type}
        onChange={(event) => setFilters({ type: event.target.value as TransactionType | "" })}
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select
        className={selectClassName}
        value={category}
        onChange={(event) => setFilters({ category: event.target.value })}
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {(type || category) && (
        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default TransactionFilter;