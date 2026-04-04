import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, Transaction, Filters } from "../types";

export type ViewTab = "dashboard" | "transactions" | "insights";

interface AppState {
  role: Role;
  transactions: Transaction[];
  filters: Filters;
  activeTab: ViewTab;
  setRole: (role: Role) => void;
  setTransactions: (data: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  setActiveTab: (tab: ViewTab) => void;
}

const DEFAULT_FILTERS: Filters = { search: "", category: "", type: "" };

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      role: "viewer",
      transactions: [],
      filters: DEFAULT_FILTERS,
      activeTab: "dashboard",
      setRole: (role) => set({ role }),
      setTransactions: (data) => set({ transactions: data }),
      addTransaction: (transaction) =>
        set((state) => ({ transactions: [...state.transactions, transaction] })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((item) => item.id !== id),
        })),
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    { name: "fintrack-storage" }
  )
);