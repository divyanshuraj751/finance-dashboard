import type { Transaction } from "../types";

export const getTotalIncome = (transactions: Transaction[]) =>
  transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);

export const getTotalExpense = (transactions: Transaction[]) =>
  transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);

export const getBalance = (transactions: Transaction[]) =>
  getTotalIncome(transactions) - getTotalExpense(transactions);

export const getSavingsRate = (transactions: Transaction[]) => {
  const totalIncome = getTotalIncome(transactions);
  return totalIncome === 0 ? 0 : Math.round((getBalance(transactions) / totalIncome) * 100);
};

export const getMonthlyBreakdown = (transactions: Transaction[]) => {
  const breakdown: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((transaction) => {
    const monthKey = transaction.date.slice(0, 7);
    if (!breakdown[monthKey]) breakdown[monthKey] = { income: 0, expense: 0 };
    breakdown[monthKey][transaction.type] += transaction.amount;
  });
  return breakdown;
};

const buildCategoryMap = (transactions: Transaction[]) => {
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });
  return categoryTotals;
};

export const getTopCategoryData = (transactions: Transaction[]) => {
  const categoryTotals = buildCategoryMap(transactions);
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const grandTotal = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
  return {
    topCategory: sortedCategories[0]?.[0] || "No data",
    topCategoryAmount: sortedCategories[0]?.[1] || 0,
    percentage: grandTotal > 0 ? Math.round(((sortedCategories[0]?.[1] || 0) / grandTotal) * 100) : 0,
  };
};

export const getExpenseByCategory = (transactions: Transaction[]) =>
  Object.entries(buildCategoryMap(transactions))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);