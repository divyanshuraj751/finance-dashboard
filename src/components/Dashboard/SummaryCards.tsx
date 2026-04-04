import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../state/useAppStore";
import { getTotalIncome, getTotalExpense, getBalance, getMonthlyBreakdown } from "../utils/calculations";
import { formatCurrency } from "../utils/formatCurrency";
import Card from "../Common/Card";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

const useCountUp = (target: number, duration = 1200) => {
  const [currentValue, setCurrentValue] = useState(0);
  const startTime = useRef<number>(0);
  const animationFrame = useRef(0);

  useEffect(() => {
    startTime.current = 0;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      setCurrentValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [target, duration]);

  return currentValue;
};

const SummaryCards = () => {
  const transactions = useAppStore((state) => state.transactions);
  const income = getTotalIncome(transactions);
  const expense = getTotalExpense(transactions);
  const balance = getBalance(transactions);
  const animatedIncome = useCountUp(income);
  const animatedExpense = useCountUp(expense);
  const animatedBalance = useCountUp(Math.abs(balance));

  const monthlyData = getMonthlyBreakdown(transactions);
  const sortedMonths = Object.keys(monthlyData).sort();
  const currentMonth = sortedMonths[sortedMonths.length - 1];
  const previousMonth = sortedMonths[sortedMonths.length - 2];

  const getPercentChange = (type: "income" | "expense") => {
    if (!currentMonth || !previousMonth) return null;
    const currentValue = monthlyData[currentMonth]?.[type] || 0;
    const previousValue = monthlyData[previousMonth]?.[type] || 0;
    return previousValue === 0 ? null : Math.round(((currentValue - previousValue) / previousValue) * 100);
  };

  const cards = [
    {
      label: "Total Balance",
      value: formatCurrency(balance >= 0 ? animatedBalance : -animatedBalance),
      icon: Wallet,
      iconBackground: "bg-indigo-100 dark:bg-indigo-500/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      valueColor: balance >= 0 ? "text-slate-800 dark:text-slate-100" : "text-rose-500",
      change: null as number | null,
      delay: "animation-delay-100",
    },
    {
      label: "Total Income",
      value: formatCurrency(animatedIncome),
      icon: TrendingUp,
      iconBackground: "bg-emerald-100 dark:bg-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      valueColor: "text-slate-800 dark:text-slate-100",
      change: getPercentChange("income"),
      delay: "animation-delay-200",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(animatedExpense),
      icon: TrendingDown,
      iconBackground: "bg-rose-100 dark:bg-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      valueColor: "text-slate-800 dark:text-slate-100",
      change: getPercentChange("expense"),
      delay: "animation-delay-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.label} className={`relative overflow-hidden group animate-fade-in-up ${card.delay}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 ${card.iconBackground} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</h3>
                {card.change !== null && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      (card.label === "Total Expenses" ? card.change > 0 : card.change < 0)
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                    }`}
                  >
                    {card.change >= 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(card.change)}%
                  </span>
                )}
              </div>
              <p className={`text-2xl font-bold mt-1 animate-count-up ${card.valueColor}`}>
                {card.value}
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-indigo-500 to-purple-500" />
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;