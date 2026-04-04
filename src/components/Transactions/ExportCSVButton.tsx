import { Download } from "lucide-react";
import { useAppStore } from "../state/useAppStore";
import { filterTransactions } from "../services/transactionService";
import { showToast } from "../Common/Toast";

const ExportCSVButton = () => {
  const transactions = useAppStore((state) => state.transactions);
  const filters = useAppStore((state) => state.filters);
  const filteredData = filterTransactions(transactions, filters);

  const handleExport = () => {
    if (!filteredData.length) {
      showToast("No data to export", "error");
      return;
    }

    const csvRows = filteredData.map((transaction) =>
      [
        transaction.date,
        `"${transaction.description.replace(/"/g, '""')}"`,
        transaction.category,
        transaction.type,
        transaction.amount,
      ].join(",")
    );
    const csvContent = ["Date,Description,Category,Type,Amount", ...csvRows].join("\n");
    const blobUrl = URL.createObjectURL(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }));
    const downloadLink = Object.assign(document.createElement("a"), {
      href: blobUrl,
      download: `transactions_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobUrl);
    showToast(`Exported ${filteredData.length} transactions to CSV`);
  };

  return (
    <button
      onClick={handleExport}
      title="Export records to CSV"
      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
};

export default ExportCSVButton;
