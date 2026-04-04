export type Role = "admin" | "viewer";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export interface Filters {
  search: string;
  category: string;
  type: TransactionType | "";
}