import TransactionSearch from "./TransactionSearch";
import TransactionFilter from "./TransactionFilter";
import TransactionModal from "./TransactionModal";
import ExportCSVButton from "./ExportCSVButton";

const TransactionControls = () => (
  <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
    <div className="flex flex-wrap items-center gap-3">
      <TransactionSearch />
      <TransactionFilter />
      <TransactionModal />
    </div>
    <ExportCSVButton />
  </div>
);

export default TransactionControls;
