import { useAppStore } from "../state/useAppStore";
import { getMonthlyBreakdown } from "../utils/calculations";
import { formatCurrency } from "../utils/formatCurrency";
import Card from "../Common/Card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const formatYAxis = (value: number) =>
  value >= 100000
    ? `₹${(value / 100000).toFixed(1)}L`
    : value >= 1000
    ? `₹${(value / 1000).toFixed(0)}K`
    : `₹${value}`;

const ChartTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700/50 shadow-xl rounded-xl backdrop-blur-sm">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400 capitalize">{entry.name}:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  ) : null;

const DashboardChart = () => {
  const transactions = useAppStore((state) => state.transactions);
  const chartData = Object.entries(getMonthlyBreakdown(transactions))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, values]) => ({ name, income: values.income, expense: values.expense }));

  if (!chartData.length) {
    return (
      <Card className="h-[340px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            Cash Flow Trend
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm">No data available.</p>
        </div>
      </Card>
    );
  }

  const createDotStyle = (color: string) => ({ r: 4, fill: color, stroke: "#fff", strokeWidth: 2 });
  const createActiveDotStyle = (color: string) => ({ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 });

  return (
    <Card className="p-6 animate-fade-in-up animation-delay-200">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Cash Flow Trend</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {[
                ["colorIncome", "#10b981"],
                ["colorExpense", "#f43f5e"],
              ].map(([id, color]) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.15} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={formatYAxis} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" dot={createDotStyle("#10b981")} activeDot={createActiveDotStyle("#10b981")} />
            <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" dot={createDotStyle("#f43f5e")} activeDot={createActiveDotStyle("#f43f5e")} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DashboardChart;