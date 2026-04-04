import { useState, useEffect } from "react";
import { useAppStore } from "../state/useAppStore";
import type { Transaction, TransactionType } from "../types";
import { showToast } from "../Common/Toast";
import Button from "../Common/Button";
import { Plus, Pencil, X } from "lucide-react";

const createEmptyForm = () => ({
  description: "",
  amount: "",
  category: "",
  type: "expense" as TransactionType,
  date: new Date().toISOString().slice(0, 10),
});

const inputClassName =
  "w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 transition-all";

const labelClassName =
  "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5";

interface TransactionModalProps {
  editTransaction?: Transaction | null;
  onCloseEdit?: () => void;
}

const TransactionModal = ({ editTransaction = null, onCloseEdit }: TransactionModalProps) => {
  const role = useAppStore((state) => state.role);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const updateTransaction = useAppStore((state) => state.updateTransaction);
  const existingCategories = [
    ...new Set(useAppStore((state) => state.transactions).map((transaction) => transaction.category)),
  ].sort();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(createEmptyForm);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = !!editTransaction;
  const modalOpen = isEditMode ? true : isOpen;

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        description: editTransaction.description,
        amount: editTransaction.amount.toString(),
        category: editTransaction.category,
        type: editTransaction.type,
        date: editTransaction.date,
      });
    }
  }, [editTransaction]);

  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  if (role !== "admin") return null;

  const closeModal = () => {
    setFormData(createEmptyForm());
    setErrorMessage("");
    if (isEditMode && onCloseEdit) {
      onCloseEdit();
    } else {
      setIsOpen(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.description.trim() || !formData.amount || !formData.category.trim()) {
      return setErrorMessage("Please fill in all fields");
    }
    if (Number(formData.amount) <= 0) {
      return setErrorMessage("Amount must be greater than 0");
    }
    if (!formData.date) {
      return setErrorMessage("Please select a date");
    }

    if (isEditMode && editTransaction) {
      updateTransaction(editTransaction.id, {
        date: formData.date,
        description: formData.description.trim(),
        amount: Number(formData.amount),
        category: formData.category.trim(),
        type: formData.type,
      });
      showToast("Transaction updated successfully");
    } else {
      addTransaction({
        id: Date.now().toString(),
        date: formData.date,
        description: formData.description.trim(),
        amount: Number(formData.amount),
        category: formData.category.trim(),
        type: formData.type,
      });
      showToast("Transaction added successfully");
    }
    closeModal();
  };

  const updateForm = (updates: Partial<typeof formData>) =>
    setFormData((previous) => ({ ...previous, ...updates }));

  const renderTypeButton = (type: TransactionType, label: string, activeColor: string) => (
    <button
      type="button"
      onClick={() => updateForm({ type })}
      className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer ${
        formData.type === type
          ? `${activeColor} text-white`
          : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {!isEditMode && (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-[420px] max-w-[95vw] shadow-2xl border border-slate-200 dark:border-slate-700 animate-scale-in"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) =>
              event.key === "Enter" && !event.shiftKey && (event.preventDefault(), handleSubmit())
            }
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {isEditMode ? (
                  <Pencil className="w-5 h-5 text-indigo-500" />
                ) : (
                  <Plus className="w-5 h-5 text-indigo-500" />
                )}
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {isEditMode ? "Edit Transaction" : "Add Transaction"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <p className="text-rose-500 text-sm mb-4 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-lg border border-rose-200 dark:border-rose-500/20">
                {errorMessage}
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label className={labelClassName}>Date *</label>
                <input
                  type="date"
                  className={inputClassName}
                  value={formData.date}
                  onChange={(event) => updateForm({ date: event.target.value })}
                />
              </div>
              <div>
                <label className={labelClassName}>Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Salary, Groceries"
                  className={inputClassName}
                  value={formData.description}
                  onChange={(event) => updateForm({ description: event.target.value })}
                  autoFocus
                />
              </div>
              <div>
                <label className={labelClassName}>Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="0"
                  min="1"
                  className={inputClassName}
                  value={formData.amount}
                  onChange={(event) => updateForm({ amount: event.target.value })}
                />
              </div>
              <div>
                <label className={labelClassName}>Category *</label>
                <input
                  type="text"
                  list="category-datalist"
                  placeholder="e.g. Food, Transport"
                  className={inputClassName}
                  value={formData.category}
                  onChange={(event) => updateForm({ category: event.target.value })}
                />
                <datalist id="category-datalist">
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Select existing or type a new category
                </p>
              </div>
              <div>
                <label className={labelClassName}>Type *</label>
                <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {renderTypeButton("expense", "Expense", "bg-rose-500")}
                  {renderTypeButton("income", "Income", "bg-emerald-500")}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {isEditMode ? "Save Changes" : "Add Transaction"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionModal;