import { useState, useMemo } from "react";
import { useAppStore } from "../state/useAppStore";
import { filterTransactions } from "../services/transactionService";
import { formatCurrency } from "../utils/formatCurrency";
import { ROLES } from "../constants/roles";
import { showToast } from "../Common/Toast";
import EmptyState from "../Common/EmptyState";
import Button from "../Common/Button";
import TransactionModal from "./TransactionModal";
import type { Transaction } from "../types";
import { ChevronLeft, ChevronRight, ArrowUpDown, Trash2, Pencil, AlertTriangle } from "lucide-react";

type SortKey = "date" | "amount";
const PAGE_SIZE = 8;

const TransactionTable = () => {
  const transactions = useAppStore((state) => state.transactions);
  const filters = useAppStore((state) => state.filters);
  const role = useAppStore((state) => state.role);
  const deleteTransaction = useAppStore((state) => state.deleteTransaction);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const isAdmin = role === ROLES.ADMIN;

  const filteredData = filterTransactions(transactions, filters);
  const sortedData = useMemo(
    () =>
      [...filteredData].sort((a, b) => {
        const comparison = sortKey === "date" ? a.date.localeCompare(b.date) : a.amount - b.amount;
        return sortDirection === "asc" ? comparison : -comparison;
      }),
    [filteredData, sortKey, sortDirection]
  );

  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleRows = sortedData.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handleConfirmDelete = (id: string) => {
    deleteTransaction(id);
    setDeleteTargetId(null);
    showToast("Transaction deleted", "error");
    if (visibleRows.length === 1 && safePage > 1) setCurrentPage(safePage - 1);
  };

  if (!filteredData.length) {
    return <EmptyState message="No transactions found" description="Try adjusting your filters" />;
  }

  const SortableHeader = ({
    sortableKey,
    label,
    alignRight,
  }: {
    sortableKey: SortKey;
    label: string;
    alignRight?: boolean;
  }) => (
    <th
      className={`p-4 ${alignRight ? "text-right" : "text-left"} whitespace-nowrap cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors select-none group`}
      onClick={() => handleSort(sortableKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`w-3 h-3 transition-opacity ${
            sortKey === sortableKey ? "opacity-100 text-indigo-500" : "opacity-0 group-hover:opacity-50"
          }`}
        />
        {sortKey === sortableKey && (
          <span className="text-[10px] text-indigo-500 font-bold">
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        )}
      </span>
    </th>
  );

  const MobileCard = ({ transaction, index }: { transaction: Transaction; index: number }) => {
    const isIncome = transaction.type === "income";
    return (
      <div
        className="p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-xl animate-fade-in shadow-sm"
        style={{ animationDelay: `${index * 40}ms` }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                isIncome
                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
              }`}
            >
              {isIncome ? "+" : "−"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                {transaction.description}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {transaction.date} · {transaction.category}
              </p>
            </div>
          </div>
          <span
            className={`text-sm font-bold whitespace-nowrap ml-2 ${
              isIncome ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
              isIncome
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
            }`}
          >
            {transaction.type}
          </span>
          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditingTransaction(transaction)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all cursor-pointer"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteTargetId(transaction.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile card view */}
      <div className="md:hidden mt-4 space-y-3 animate-fade-in-up">
        {visibleRows.map((transaction, index) => (
          <MobileCard key={transaction.id} transaction={transaction} index={index} />
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-800/80 backdrop-blur-sm animate-fade-in-up">
        <table className="w-full text-sm text-slate-800 dark:text-slate-200">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
            <tr>
              <SortableHeader sortableKey="date" label="Date" />
              <th className="p-4 text-left whitespace-nowrap">Description</th>
              <th className="p-4 text-left whitespace-nowrap">Category</th>
              <SortableHeader sortableKey="amount" label="Amount" alignRight />
              <th className="p-4 text-center whitespace-nowrap">Type</th>
              {isAdmin && <th className="p-4 text-center whitespace-nowrap">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {visibleRows.map((transaction, index) => {
              const isIncome = transaction.type === "income";
              return (
                <tr
                  key={transaction.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-colors duration-150 animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-xs">
                    {transaction.date}
                  </td>
                  <td className="p-4 font-medium whitespace-nowrap">{transaction.description}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-md text-xs text-slate-600 dark:text-slate-300">
                      {transaction.category}
                    </span>
                  </td>
                  <td
                    className={`p-4 text-right font-semibold whitespace-nowrap tabular-nums ${
                      isIncome ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                        isIncome
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setEditingTransaction(transaction)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(transaction.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-1 gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <b className="text-slate-700 dark:text-slate-200">
              {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sortedData.length)}
            </b>{" "}
            of <b className="text-slate-700 dark:text-slate-200">{sortedData.length}</b>
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(safePage - 1)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  pageNumber === safePage
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTargetId && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setDeleteTargetId(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-80 shadow-2xl border border-slate-200 dark:border-slate-700 animate-scale-in"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Delete Transaction
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleConfirmDelete(deleteTargetId)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingTransaction && (
        <TransactionModal
          editTransaction={editingTransaction}
          onCloseEdit={() => setEditingTransaction(null)}
        />
      )}
    </>
  );
};

export default TransactionTable;