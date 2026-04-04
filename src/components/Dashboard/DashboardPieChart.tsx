import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Card from "../Common/Card";
import { useAppStore } from "../state/useAppStore";
import { getExpenseByCategory, getTotalExpense } from "../utils/calculations";
import { formatCurrency } from "../utils/formatCurrency";

const CHART_COLORS = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"];

const PieTooltip = ({ active, payload }: any) =>
  active && payload?.length ? (
    <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700/50 shadow-xl rounded-xl backdrop-blur-sm">
      <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">{payload[0].name}</p>
      <p className="text-rose-500 font-bold">{formatCurrency(payload[0].value)}</p>
    </div>
  ) : null;

const DashboardPieChart = () => {
  const transactions = useAppStore((state) => state.transactions);
  const categoryData = getExpenseByCategory(transactions);
  const totalExpense = getTotalExpense(transactions);

  return (
    <Card className="p-6 animate-fade-in-up animation-delay-300">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
        Spending Breakdown
      </h3>
      {!categoryData.length ? (
        <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
          No expenses recorded yet.
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                animationBegin={200}
                animationDuration={800}
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ paddingTop: "20px", fontSize: "13px" }}
                formatter={(value: string) => (
                  <span className="text-slate-600 dark:text-slate-300">{value}</span>
                )}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-slate-800 dark:fill-slate-100"
              >
                <tspan x="50%" dy="-8" fontSize="12" className="fill-slate-400 dark:fill-slate-500">
                  Total
                </tspan>
                <tspan x="50%" dy="22" fontSize="16" fontWeight="700">
                  {formatCurrency(totalExpense)}
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default DashboardPieChart;
