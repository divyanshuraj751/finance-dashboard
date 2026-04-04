import type { Transaction, Filters } from "../types";

export const filterTransactions = (transactions: Transaction[], filters: Filters) =>
  transactions.filter((transaction) => {
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.category && transaction.category !== filters.category) return false;
    if (filters.search) {
      const query = filters.search.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query)
      );
    }
    return true;
  });