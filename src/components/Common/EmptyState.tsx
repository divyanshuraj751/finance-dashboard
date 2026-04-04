import { Inbox } from "lucide-react";

const EmptyState = ({ message = "No data available", description }: { message?: string; description?: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
      <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500" />
    </div>
    <p className="text-slate-500 dark:text-slate-400 font-medium">{message}</p>
    {description && <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{description}</p>}
  </div>
);
export default EmptyState;