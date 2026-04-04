import type { Transaction } from "../types";

export const transactions: Transaction[] = [
  { id: "1",  date: "2026-03-01", description: "Salary",      amount: 75000, category: "Salary",        type: "income"  },
  { id: "2",  date: "2026-03-05", description: "Groceries",   amount: 3200,  category: "Food",          type: "expense" },
  { id: "3",  date: "2026-03-10", description: "Freelance",   amount: 20000, category: "Freelance",     type: "income"  },
  { id: "4",  date: "2026-03-15", description: "Electricity", amount: 1800,  category: "Utilities",     type: "expense" },
  { id: "5",  date: "2026-03-18", description: "Netflix",     amount: 499,   category: "Entertainment", type: "expense" },
  { id: "6",  date: "2026-03-22", description: "Metro card",  amount: 500,   category: "Transport",     type: "expense" },
  { id: "7",  date: "2026-03-25", description: "Bonus",       amount: 10000, category: "Salary",        type: "income"  },
  { id: "8",  date: "2026-03-28", description: "Restaurant",  amount: 1400,  category: "Food",          type: "expense" },

  { id: "9",  date: "2026-04-01", description: "Salary",      amount: 75000, category: "Salary",        type: "income"  },
  { id: "10", date: "2026-04-02", description: "Groceries",   amount: 2800,  category: "Food",          type: "expense" },
  { id: "11", date: "2026-04-03", description: "Electricity", amount: 1600,  category: "Utilities",     type: "expense" },
  { id: "12", date: "2026-04-04", description: "Freelance",   amount: 15000, category: "Freelance",     type: "income"  },
  { id: "13", date: "2026-04-04", description: "Netflix",     amount: 499,   category: "Entertainment", type: "expense" },
];