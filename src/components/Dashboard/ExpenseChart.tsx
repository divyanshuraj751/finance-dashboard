import { useAppStore } from "../state/useAppStore";
import { getExpenseByCategory } from "../utils/calculations";
import { formatCurrency } from "../utils/formatCurrency";
import Card from "../Common/Card";

const ExpenseChart = () => {
  const expenseData = getExpenseByCategory(useAppStore((state) => state.transactions));
  const totalExpense = expenseData.reduce((sum, item) => sum + item.value, 0);

  if (!expenseData.length) {
    return (
      <Card>
        <h3 className="text-sm text-gray-500 mb-2">Expense Breakdown</h3>
        <p className="text-gray-400 text-sm">No expenses yet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm text-slate-500 dark:text-slate-400 mb-3">Expense Breakdown</h3>
      <div className="space-y-2">
        {expenseData.map(({ name, value }) => {
          const percentage = totalExpense > 0 ? Math.round((value / totalExpense) * 100) : 0;
          return (
            <div key={name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 dark:text-slate-300">{name}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {formatCurrency(value)} · {percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700/50 h-2 rounded">
                <div className="bg-rose-400 h-2 rounded" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ExpenseChart;