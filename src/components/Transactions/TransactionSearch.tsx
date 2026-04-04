import { useState, useEffect } from "react";
import { useAppStore } from "../state/useAppStore";

const TransactionSearch = () => {
  const setFilters = useAppStore((state) => state.setFilters);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setFilters({ search: searchText }), 300);
    return () => clearTimeout(timer);
  }, [searchText, setFilters]);

  return (
    <div className="w-full md:w-64">
      <input
        type="text"
        placeholder="Search by description or category..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />
    </div>
  );
};

export default TransactionSearch;